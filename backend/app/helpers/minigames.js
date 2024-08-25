const fs = require("fs");
const path = require("path");

const minigamesChatId = parseInt(process.env.MINIGAMES_CHAT_ID);

const findImages = async (Model, folderName) => {
  // find files of images in folder static/secretkey
  const folderPath = path.join(__dirname, `../../static/${folderName}`);
  let fileNames = fs.readdirSync(folderPath);
  fileNames = fileNames.filter((fileName) => fileName !== ".gitkeep");
  let allImages = await Model.find();

  // for images that are in the folder but not in the database, add them to the database
  for (const fileName of fileNames) {
    const isExist = allImages.find((image) => image.fileName === fileName);
    if (!isExist) {
      const number = fileNames.indexOf(fileName) + 1;
      await Model.create({ fileName, number });
    }
  }

  allImages = await Model.find();
  return allImages;
}

const generateRandomKey = (images, count, bot, date, type, updateHours) => {
  if (images.length < count) {
    return console.error(`Not enough images to generate a ${type}`);
  }

  const key = [];
  const availableImages = [...images]; // Create a copy of the array

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    key.push(availableImages[randomIndex].number);
    availableImages.splice(randomIndex, 1); // Remove the used image
  }

  const todayKeyDate = new Date();
  const hour = todayKeyDate.getUTCHours();
  todayKeyDate.setUTCHours(updateHours, 0, 0, 0);
  if (hour <= updateHours) {
    todayKeyDate.setUTCDate(todayKeyDate.getUTCDate() - 1);
  }

  return key;
}

const generateCombo = (comboImages, bot, date) => {
  return generateRandomKey(comboImages, 5, bot, date, 'combo', 10);
}

const generateSecretKey = (secretKeyImages, bot, date) => {
  return generateRandomKey(secretKeyImages, 8, bot, date, 'secret key', 15);
}

const getStartEndTimes = (thresholdHour) => {
  const now = new Date();
  const hour = now.getUTCHours();

  let start, end;

  if (hour >= thresholdHour) {
    start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), thresholdHour, 0, 0));
    end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, thresholdHour, 0, 0));
  } else {
    start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, thresholdHour, 0, 0));
    end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), thresholdHour, 0, 0));
  }

  return { start, end };
};

module.exports = { findImages, generateCombo, generateSecretKey, getStartEndTimes };