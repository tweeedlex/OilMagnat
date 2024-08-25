const subscribeMessage = `Before you continue, please subscribe:`;

const howToPlayMessage = `🦀 <b>What is CrabsTap?</b>
It is a game in which the players can mine coins that will be converted into $CRABS tokens in the future.
The focus will be on decentralization, and all tokens will be owned by the community.`;

const howToPlayInfo = `💰 <b>How to get tokens?</b>
It's very simple. Tap on the screen, that's it.

☝🏽 <b>Why you should play this?</b>
1. It's free
2. It's fun
3. It might bring bonuses in the future.
4. We have global goals to enter the crypto market.

💸 <b>How to get more coins?</b>
To get ahead of other players, you can increase your coin mining speed with boosters:

<b>Claw</b> - Autonomously mines tokens every hour. You need to be in the game to collect the accumulated tokens..
<b>Energy</b> - Restores energy every second;
<b>Shovel</b> - Increases coin collection per tap;
<b>Burger</b> - Increases your maximum energy reserve;

Also use the free temporary boosters:

<b>Fish in a Bun</b> - Accelerates token mining by 5 times, lasts 15 seconds;
<b>Energizer</b> - Speeds up token mining by 10 times, lasts 20 seconds.

🏆 <b>Leaderboard</b>
The leaderboard shows the most active players in <b>CrabsTap</b> universe. Depending on your ranking you will receive additional coins.

⛳️ <b>Tasks</b>
Complete different types of tasks and get extra coins.

👥 <b>Referral Program</b>
Invite your friends and get a portion of tokens from their taps. 

1 line - <b>5%</b>
2 line - <b>3%</b>
3 line - <b>1%</b>

Example:

You invited a player (<b>1st line</b>).
This player earns 1000 tokens.
You will receive 5% of that amount, which is 50 tokens.
If this player (1st line) also invites a player (<b>2nd line</b>),
you will receive 3% of the tokens earned by the 2nd line player.
And so on for <b>3 lines</b>.

You and your friend will each receive 5000 coins instantly, and there are no limits on referrals! 💰

Press the <b>Let's Tap</b> button and start earning coins!`;

const loginedMessage = `<b>Glad to have you on board, my dear friend 🦀</b>
      
Tap the greedy crab's money bag 
crab and get your tokens🤑

Upgrade your <b>spatula</b> and boost your <b>energy</b>
reserves to earn even more! ⚡️

Invite your friends 👥 and take a part of their coins thanks to our affiliate program.

❗️All tokens will be community-owned, with a focus on <b>decentralization</b>.

<b>Ready?</b> - Hit the <b>Let’s Tap</b> button and start tapping 🔥`;

const errorSubscriptionsMessage = `❌ <b>You are not subscribed to the channels, subscribe to continue</b>`;

const addWalletMessage = `Add your wallet address in 🟣<b>SOLANA</b> network to receive payments from future <b>AIRDROPs</b> and bonuses for Leaderboard positions.

⚠️ You cannot use addresses from CEX exchanges.`;

const saveWalletMessage = (walletAddress) =>
  `Your "${walletAddress}" wallet on the SOLANA network has been successfully saved!`;

const invalidSolanaAddressMessage = `Incorrect address format, try again.`;

const joinCommunityMessage = `Join our communities to be on the same information wave as the crab🔉`;

module.exports = {
  howToPlayMessage,
  howToPlayInfo,
  loginedMessage,
  errorSubscriptionsMessage,
  addWalletMessage,
  joinCommunityMessage,
  saveWalletMessage,
  invalidSolanaAddressMessage,
  subscribeMessage,
};
