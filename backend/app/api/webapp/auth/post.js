const { Router } = require("express");
const { uploadAvatarWithUrl } = require("../../../helpers/uploadAvatar");
const { generateToken, verifyInitData, urlSearchParamsToObject } = require("../../../helpers/auth");

module.exports = Router({ mergeParams: true }).post("/auth", async (req, res, next) => {
	try {
		const { db, tgBot, ApiError } = req;
		let { initData } = req.body;
		const isDataValid = verifyInitData(initData);

		if (!isDataValid) {
			return next(ApiError.UnauthorizedError("Invalid auth data"));
		}

		initData = urlSearchParamsToObject(initData);
		initData.user = JSON.parse(initData.user);

		const { token, expiresIn } = generateToken(initData);

		// getting ip address from proxy header
		const forwarded = req.headers["x-forwarded-for"];
		let user = await db.User.findOneAndUpdate(
			{ tgId: initData.user.id },
			{
				$inc: { loginsCount: 1 },
				lastLoginDate: new Date(),
				lastLoginIp: forwarded ? forwarded.split(",")[0] : req.ip,
				isBotBlocked: !initData.user.allows_write_to_pm,
				isGotInactiveMessage: false,
			},
			{ new: true }
		);

		if (!user) {
			return next(ApiError.UnauthorizedError(`Cannot find user with tgId: ${initData.user.id}`));
		}

		if (!user.dailyUserInfoUpdated) {
			updateUserInfo(db, tgBot, initData, user);
		}
		let userPosition = await db.User.getPosition(db, initData.user.id);
		user._doc.position = userPosition;

		return res.json({ token, expiresIn, user, position: userPosition });
	} catch (error) {
		next(error);
	}
});

async function updateUserInfo(db, tgBot, initData, user) {
	const userProfilePhotos = await tgBot.getUserProfilePhotos(initData.user.id);
	if (userProfilePhotos && userProfilePhotos.total_count > 0) {
		const fileId = userProfilePhotos.photos[0][0].file_id;
		if (fileId == user.tgAvatarFileId) {
			return;
		}

		const file = await tgBot.getFile(fileId);
		// Construct the URL for the file
		let url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

		// download and upload avatar
		let uploadResponse = await uploadAvatarWithUrl(url, { tgId: initData.user.id });

		if (uploadResponse.error == false) {
			user = await db.User.findOneAndUpdate(
				{ tgId: initData.user.id },
				{
					tgAvatarFileId: fileId,
					avatarUrl: uploadResponse.fileName,
					tgUsername: initData.user.username,
					nickName: initData.user.first_name,
					dailyUserInfoUpdated: true,
				}
			);
		}
	}
}
