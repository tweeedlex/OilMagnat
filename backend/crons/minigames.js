const cron = require("node-cron");
const {generateCombo, generateSecretKey, getStartEndTimes} = require("../app/helpers/minigames");
const minigamesChatId = parseInt(process.env.MINIGAMES_CHAT_ID);

const resetUserSecretKeyFields = async (db) => {
  //   for each user, update isGuessedSecretKey to false and secretKeyAttempts to 0
  await db.User.updateMany(
    {},
    {
      $set: {
        isGuessedSecretKey: false,
        isGuessingSecretKey: false,
        secretKeyAttempts: 0,
      },
    }
  );
}

const resetUserComboFields = async (db) => {
  //   for each user, update isTriedCombo
  await db.User.updateMany(
    {},
    {
      $set: {
        isTriedCombo: false,
      },
    }
  );
}

const addMinigameKeys = async (db, model, imagesModel, generateKeyFunc, bot, hours, label) => {
  const yesterday = new Date();
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  const twoDaysAfter = new Date(yesterday);
  twoDaysAfter.setDate(yesterday.getDate() + 4);
  twoDaysAfter.setUTCHours(0, 0, 0, 0);

  const existingRecords = await db[model].find({
    date: { $gte: yesterday, $lt: twoDaysAfter },
  });

  const images = await db[imagesModel].find();

  for (let i = 0; i < 4; i++) {
    const dateToCheck = new Date(yesterday);
    dateToCheck.setDate(yesterday.getDate() + i);
    dateToCheck.setUTCHours(hours, 0, 0, 0);

    const record = existingRecords.find((rec) => rec?.date?.getTime() === dateToCheck.getTime());

    if (!record) {
      const key = generateKeyFunc(images, bot, dateToCheck);
      await db[model].create({ key, date: dateToCheck });
      console.log(`Generated ${label} for day`, dateToCheck.getDate());
    }
  }
}

const addSecretKeys = async (db, bot) => {
  await addMinigameKeys(db, 'SecretKey', 'SecretKeyImage', generateSecretKey, bot, 15, 'secret key');
}

const addCombos = async (db, bot) => {
  await addMinigameKeys(db, 'Combo', 'ComboImage', generateCombo, bot, 10, 'combo');
}

const sendMessageForToday = async (db, bot, collectionName, thresholdHour, messageType) => {
  const now = new Date();
  const day = now.getUTCDate();
  const month = now.getUTCMonth() + 1;

  const { start, end } = getStartEndTimes(thresholdHour);

  const document = await db[collectionName].findOne({
    date: {
      $gte: start,
      $lt: end,
    },
  });

  if (!document) {
    console.error(`${messageType} not found for today`);
    return;
  }

  bot.sendMessage(
    minigamesChatId,
    `${collectionName} for today (${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}): ${document.key.join(" ")}`
  )
  .catch(err => {
    console.error(`${messageType} message error:`, err);
  });
};

const sendSecretKeyForToday = async (db, bot) => {
  await sendMessageForToday(db, bot, 'SecretKey', 15, 'secret key');
}

const sendComboForToday = async (db, bot) => {
  await sendMessageForToday(db, bot, 'Combo', 10, 'combo');
}

const startMinigamesSchedule = (db, bot) => {
  addSecretKeys(db, bot);
  addCombos(db, bot);
  cron.schedule(
    "0 15 * * *",
    () => {
      addSecretKeys(db, bot).then(() => {
        sendSecretKeyForToday(db, bot)
      })
      resetUserSecretKeyFields(db);
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  cron.schedule(
    "0 10 * * *",
    () => {
      addCombos(db, bot).then(() => {
        sendComboForToday(db, bot)
      })
      resetUserComboFields(db);
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  console.log("Scheduled minigames job.");
};

module.exports = startMinigamesSchedule;
