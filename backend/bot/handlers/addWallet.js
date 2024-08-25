const fs = require('fs');
const path = require('path');
const WalletPhotoPath = path.join(__dirname, '..', 'media', 'wallet.jpg');
const {idToString} = require('../helpers/helpers');
const {addWalletMessage, saveWalletMessage, invalidSolanaAddressMessage} = require('../messages/messages');

async function addWallet(query, db, bot) {
  const {User} = db;

  const chatId = query.message.chat.id;
  await bot.sendPhoto(chatId, fs.createReadStream(WalletPhotoPath), {caption: addWalletMessage, parse_mode: "HTML"});

  bot.once('message', async (msg) => {
    const walletAddress = msg.text;

    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    if (solanaAddressRegex.test(walletAddress)) {
      await User.findOneAndUpdate(
        {tgId: idToString(msg.from.id)},
        {solanaAddress: walletAddress}
      );

      bot.sendMessage(chatId, saveWalletMessage(walletAddress));
    } else {
      bot.sendMessage(chatId, invalidSolanaAddressMessage);
    }
  });
}

module.exports = addWallet;