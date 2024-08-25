const path = require("path");
const fs = require("fs");
const axios = require("axios");

const uploadAvatarWithUrl = async (url, user) => {
	try {
		const ext = url.split(".").pop();
		const filePath = path.resolve(__dirname, "..", "..", "static", "avatars", `${user.tgId}.${ext}`);

		if (!fs.existsSync(path.dirname(filePath))) {
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
		}

		const response = await axios({
			url: url,
			method: "GET",
			responseType: "stream",
		});

		const writer = fs.createWriteStream(filePath);

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on("finish", () => {
				console.log(`Your avatar has been saved to the server at: ${filePath}`);
				resolve({
					error: false,
					filePath,
					fileName: `${user.tgId}.${ext}`,
				});
			});

			writer.on("error", (err) => {
				console.error(err);
				console.log("An error occurred while saving your avatar.");
				reject({ error: true, filePath });
			});
		});
	} catch (err) {
		console.error(err);
		return { error: true, filePath: null };
	}
};

module.exports = { uploadAvatarWithUrl };
