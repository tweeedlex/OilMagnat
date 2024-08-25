const updateDocument = require("./updateDocument")

const updateSettingsDocument = async (db) => {
  try {
    await updateDocument(db.Settings);
    console.log("Settings updated");
  } catch (e) {
    console.error("Error updating settings:", e);
  }
}

const createSettings = async (db) => {
  const settings = await db.Settings.findOne({});
  if (!settings) {
    await db.Settings.create({});
  }
};

module.exports = {updateSettingsDocument, createSettings}