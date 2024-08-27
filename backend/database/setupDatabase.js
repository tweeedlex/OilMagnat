const { updateExistingUsers } = require("./setup/user");
const { createSettings, updateSettingsDocument } = require("./setup/settings");

module.exports = (db) => {
	createSettings(db)
		.then(async () => {
			await updateSettingsDocument(db);
		})
		.then(async () => {
			await updateExistingUsers(db)
				.then(() => {
					console.log("User documents updated");
				})
				.catch((err) => {
					console.error("Error updating User documents:", err);
				});
		});
};
