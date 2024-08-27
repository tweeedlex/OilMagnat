// if new fields to model added, add them in documents in db
const updateExistingUsers = async (db) => {
	const schemaPaths = db.User.schema.paths;
	const updates = {};

	for (const path in schemaPaths) {
		if (schemaPaths.hasOwnProperty(path) && path !== "_id" && path !== "__v") {
			const field = schemaPaths[path];
			if (field.defaultValue !== undefined) {
				updates[path] = field.defaultValue;
			}
		}
	}

	const users = await db.User.find().lean();

	const bulkOps = [];

	users.forEach((user) => {
		const updateFields = {};

		for (const key in updates) {
			if (!user.hasOwnProperty(key)) {
				updateFields[key] = updates[key];
			}
		}

		if (Object.keys(updateFields).length > 0) {
			bulkOps.push({
				updateOne: {
					filter: { _id: user._id },
					update: { $set: updateFields },
				},
			});
		}
	});

	if (bulkOps.length > 0) {
		const result = await db.User.bulkWrite(bulkOps);
		// console.log("Bulk write result:", result);
	} else {
		console.log("No updates required");
	}
};

module.exports = { updateExistingUsers };
