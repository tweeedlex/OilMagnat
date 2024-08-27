const updateDocument = async (Model) => {
	const schemaPaths = Model.schema.paths;
	const updates = {};

	// Gather default values for the schema fields
	for (const path in schemaPaths) {
		if (schemaPaths.hasOwnProperty(path) && path !== "_id" && path !== "__v") {
			const field = schemaPaths[path];
			if (field.defaultValue !== undefined) {
				updates[path] = field.defaultValue;
			}
		}
	}

	// Fetch the single document
	const document = await Model.findOne().lean();

	const updateFields = {};

	// Determine which fields are missing and need to be updated
	for (const key in updates) {
		if (!document.hasOwnProperty(key)) {
			updateFields[key] = updates[key];
		}
	}

	// Perform the update if there are any fields to be set
	if (Object.keys(updateFields).length > 0) {
		const result = await Model.updateOne({}, { $set: updateFields });
		// console.log(`Model ${Model.modelName} update result:`, result);
	} else {
		console.log(`No updates required for model ${Model.modelName}`);
	}
};

module.exports = updateDocument;
