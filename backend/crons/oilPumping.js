// ? models
const SECONDS_INTERVAL = 5;

async function oilPumping(db) {
	const { User } = db;
	try {
		let users = await User.find({ isOilPumping: true });

		for (const user of users) {
		}

		// console.log(`Oil given to users.`);
	} catch (error) {
		console.error("Error giving oil users:", error);
	}
}

const startOilPumping = (db) => {
	setInterval(() => oilPumping(db), SECONDS_INTERVAL * 1000);
};

module.exports = startOilPumping;
