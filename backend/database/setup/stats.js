const updateDocument = require("./updateDocument")

const updateStatsDocument = async (db) => {
  try {
    await updateDocument(db.Stats);
    console.log("Stats updated");
  } catch (e) {
    console.error("Error updating stats:", e);
  }
}

const createStats = async (db) => {
  const stats = await db.Stats.findOne({});
  if (!stats) {
    await db.Stats.create({});
  }
};

module.exports = {updateStatsDocument, createStats}