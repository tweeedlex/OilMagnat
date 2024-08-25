const createReferralLevels = async (levelValues, db) => {
  const referralLevels = await db.ReferralLevel.find({});
  if (referralLevels.length === 0) {
    for (let percent of levelValues) {
      await db.ReferralLevel.create({ level: levelValues.indexOf(percent) + 1, rewardPercent: percent });
    }
  }
};

module.exports = {createReferralLevels}