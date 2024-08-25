const setupBotMessages = async (db) => {
	try {
		const existingMessages = await db.SendMessage.find();

		if (existingMessages.length > 0) {
			return console.log("SendMessage collection does not need to be updated");
		}

		const defaultMessages = [
			{
				type: "24hours",
				messages: [
					"Hey, tap the button to play!",
					"Don't forget to return to the game and get your reward!",
					"Hey, tap the button to return to the game!",
				],
			},
			{
				type: "claw",
				messages: ["You can receive {reward} reward from claw", "Seems you forgot to receive your claw reward"],
			},
			{
				type: "daily",
				messages: [
					"Hey, you forgot to receive your daily reward: {reward}",
					"Don't forget and get your daily reward!",
					"On {next_day} your daily streak will be lost. Receive your reward!",
				],
			},
		];

		for (const message of defaultMessages) {
			await db.SendMessage.create(message);
		}

		console.log("SendMessage collection was filled with default messages");
	} catch (error) {
		console.error("Error setting up bot messages:", error);
	}
};

module.exports = { setupBotMessages };
