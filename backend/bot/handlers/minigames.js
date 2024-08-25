const handleMinigamesCommand = async (msg, db, bot) => {
  try {
    const user = await db.User.findOne({tgId: msg.from.id});
    if (!user.roles.includes("ADMIN")) {
      return bot.sendMessage(msg.chat.id, "You don't have access to use this command.");
    }

    const now = new Date();
    const hour = now.getUTCHours();

    let startSecretKey, endSecretKey, startCombo, endCombo;

    if (hour >= 15) {
      startSecretKey = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 15, 0, 0));
      endSecretKey = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 15, 0, 0));
    } else {
      startSecretKey = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 15, 0, 0));
      endSecretKey = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 15, 0, 0));
    }

    if (hour >= 10) {
      startCombo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0));
      endCombo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 10, 0, 0));
    } else {
      startCombo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 10, 0, 0));
      endCombo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0));
    }

    const secretKey = await db.SecretKey.findOne({
      date: {
        $gte: startSecretKey,
        $lt: endSecretKey,
      },
    });

    const combo = await db.Combo.findOne({
      date: {
        $gte: startCombo,
        $lt: endCombo,
      },
    });

    await bot.sendMessage(msg.chat.id, `Secret key: ${secretKey.key.join(" ")}\nCombo: ${combo.key.join(" ")}`);
  } catch (error) {
    console.error("Error in transfer function:", error);
  }
}

module.exports = handleMinigamesCommand;