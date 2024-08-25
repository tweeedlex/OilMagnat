const {idToString} = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const websiteUrl = process.env.WEBSITE_URL;
const HowToPlayPhotoPath = path.join(__dirname, "..", "media", "how_to_play.jpg");

const { howToPlayMessage, howToPlayInfo } = require("../messages/messages.js");

async function howToPlay(msg, db, bot) {
  const { User } = db;
  try {
    const chatId = msg.message.chat.id;
    const userId = msg.from.id;
    const user = await User.findOne({tgId: idToString(userId)});

    const options = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{
            text: '🤚🏻Let’s Tap',
            web_app: {
              url: `${websiteUrl}?telegramUserId=${user.tgId}`
            }
          }],
          [{
            text: '🦀 Join Community',
            callback_data: 'join_community'
          }]
        ]
      }
    };

    await bot.sendPhoto(chatId, fs.createReadStream(HowToPlayPhotoPath), {caption: howToPlayMessage, parse_mode: 'HTML'});
    await bot.sendMessage(chatId, howToPlayInfo, options);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = howToPlay;