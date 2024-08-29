// ? models
const SECONDS_INTERVAL = 5;

async function oilPumping(db) {
	const { User } = db;
	try {
		await User.updateMany(
			{
				$expr: {
					$lt: ["$burgerEnergy", { $add: [{ $multiply: ["$burgerLevel", 500] }, 500] }],
				},
			},
			[
				{
					$set: {
						burgerEnergy: {
							$min: [
								{ $add: [{ $multiply: ["$burgerLevel", 500] }, 500] }, // значение если баланс > 1000
								{ $add: ["$burgerEnergy", { $multiply: ["$shovelLevel", 5] }] }, // прибавляем енергию умноженную на 5
							],
						},
					},
				},
			]
		);

		// console.log(`Energy given to automining users.`);
	} catch (error) {
		console.error("Error giving energy to automining users:", error);
	}
}

const startOilPumping = (db) => {
	setInterval(() => oilPumping(db), SECONDS_INTERVAL * 1000);
};

module.exports = startOilPumping;
