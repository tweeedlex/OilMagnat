const cron = require("node-cron");
const MINUTES_INTERVAL = 60;
const basePercent = 5;

async function autominingCoins(db) {
	const { User } = db;
	try {
		const autominingUsers = await User.find({ clawLevel: { $gt: 0 } });

		await User.updateMany({ clawLevel: { $gt: 0 } }, [
			{
				$set: {
					notClaimedBalance: {
						$add: [
							"$notClaimedBalance",
							{
								$divide: [
									{
										$multiply: [
											{
												$add: [basePercent, { $multiply: [0.25, "$clawLevel"] }],
											},
											{
												$cond: [
													{ $lte: ["$clawLevel", 10] },
													{ $multiply: [1000, { $pow: [1.5, { $subtract: ["$clawLevel", 1] }] }] },
													{
														$cond: [
															{ $lte: ["$clawLevel", 20] },
															{ $multiply: [1000 * Math.pow(1.5, 9), { $pow: [1.3, { $subtract: ["$clawLevel", 10] }] }] },
															{
																$multiply: [
																	1000 * Math.pow(1.5, 9) * Math.pow(1.3, 10),
																	{ $pow: [1.15, { $subtract: ["$clawLevel", 20] }] },
																],
															},
														],
													},
												],
											},
										],
									},
									2400,
								],
							},
						],
					},
				},
			},
		]);

		console.log(`Coins given to ${autominingUsers.length} automining users.`);
	} catch (error) {
		console.error("Error giving coins to automining users:", error);
	}
}

const startAutominingCoins = (db) => {
	setInterval(() => autominingCoins(db), MINUTES_INTERVAL * 60 * 1000);

	cron.schedule(
		"0 * * * *",
		() => {
			autominingCoins(db);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	console.log("Automining coins interval started.");
};

module.exports = startAutominingCoins;
