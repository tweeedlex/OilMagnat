const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	// general user settings
	tgId: { type: Number, default: 0, required: true, unique: true, index: true },
	tgUsername: { type: String, default: "" },
	nickName: { type: String, default: "", required: true },
	avatarUrl: { type: String, default: "" },
	tgAvatarFileId: { type: String, default: "" },
	dailyUserInfoUpdated: { type: Boolean, default: false },
	solanaAddress: { type: String, default: "" },
	balance: { type: Number, default: 0, required: true },
	roles: [{ type: String, ref: "Role", default: ["USER"] }],
	// game
	oilAmount: { type: Number, default: 0, required: true },
	notClaimedOil: { type: Number, default: 0, required: true },
	oilStorageLevel: { type: Number, default: 1 },
	maxOilAmount: { type: Number, default: 6.4 },
	// refferal system
	referralCode: { type: String, required: true },
	EnterReferralCode: { type: String, default: "" },
	referralEarned: { type: Number, default: 0 },
	count: { type: Number, default: 0, required: true }, // не понятно шо це
	customReferralReward: { type: Number, default: 0 },
	referrersEarnings: { type: Array, default: [] },
	// tasks
	completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [] }],
	chatIds: { type: Array, default: [] },
	// system settings
	isBotBlocked: { type: Boolean, default: false },
	// user stats info
	totalBalanceEarned: { type: Number, default: 0 },
	weekBalanceEarned: { type: Number, default: 0 },
	// system stats info
	lastLoginDate: { type: Date, default: new Date() },
	loginsCount: { type: Number, default: 1 },
	lastLoginIp: { type: String, default: "" },
	createdAt: { type: Date, default: new Date() },
});

// hidden fields in responses
userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.roles;
	delete obj.solanaAddress;
	delete obj.chatIds;
	delete obj.EnterReferralCode;
	delete obj.referrersEarnings;
	delete obj.tgAvatarFileId;
	delete obj.loginsCount;
	delete obj.lastLoginDate;
	delete obj.__v;
	delete obj._id;
	delete obj.createdAt;
	delete obj.lastLoginIp;
	delete obj.dailyUserInfoUpdated;
	delete obj.isBotBlocked;
	return obj;
};

userSchema.statics.getPosition = async function (db, userTgId) {
	try {
		const userPosition = await db.User.aggregate([
			// Шаг 1: Находим текущего пользователя
			{ $match: { tgId: userTgId } },

			// Шаг 2: Определяем позицию пользователя по балансу
			{
				$lookup: {
					from: db.User.collection.collectionName, // Имя коллекции
					let: { user_balance: "$balance" },
					pipeline: [{ $match: { $expr: { $gt: ["$balance", "$$user_balance"] } } }, { $count: "count" }],
					as: "position_info",
				},
			},

			// Шаг 3: Формируем позицию
			{
				$project: {
					position: {
						$add: [1, { $ifNull: [{ $arrayElemAt: ["$position_info.count", 0] }, 0] }],
					},
				},
			},
		]);

		// Проверка наличия результата
		if (userPosition.length === 0) {
			console.log(`Пользователь c id: ${userTgId} не найден или не имеет позиции.`);
			return -1;
		}

		const userIndex = userPosition[0].position;
		return userIndex;
	} catch (error) {
		console.error("Ошибка при определении позиции пользователя:", error);
		throw error;
	}
};

userSchema.methods.report = function () {
	this.reportAmount += 1;
	return this.save();
};

module.exports = userSchema;
