const {findImages} = require("../../app/helpers/minigames");

const setupMinigames = async (db) => {
  await findImages(db.SecretKeyImage, "secretkey");
  console.log("Scanned secretkey images");
  await findImages(db.ComboImage, "combo");
  console.log("Scanned combo images")
}

module.exports = {setupMinigames};