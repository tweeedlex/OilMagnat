const updateDocument = require("./updateDocument")

const updateSettingsPercentsDocument = async (db) => {
  await updateDocument(db.SettingsPercents);
}

const createSettingsPercents = async (db) => {
  const settingsPercents = await db.SettingsPercents.findOne({});
  if (!settingsPercents) {
    await db.SettingsPercents.create({});
  }
};

module.exports = {updateSettingsPercentsDocument, createSettingsPercents}