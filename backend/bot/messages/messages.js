const loginedMessage = `<b>Glad to have you on board, my dear friend 🦀</b>

<b>Ready?</b> - Hit the <b>Let’s Tap</b> button and start pumping oil 🔥`;

const errorSubscriptionsMessage = `❌ <b>You are not subscribed to the channels, subscribe to continue</b>`;

const addWalletMessage = `Add your wallet address in 🟣<b>SOLANA</b> network to receive payments from future <b>AIRDROPs</b> and bonuses for Leaderboard positions.

⚠️ You cannot use addresses from CEX exchanges.`;

const saveWalletMessage = (walletAddress) => `Your "${walletAddress}" wallet on the SOLANA network has been successfully saved!`;

const invalidSolanaAddressMessage = `Incorrect address format, try again.`;

const joinCommunityMessage = `Join our communities to be on the same information wave as the crab🔉`;

module.exports = {
	loginedMessage,
	errorSubscriptionsMessage,
	addWalletMessage,
	joinCommunityMessage,
	saveWalletMessage,
	invalidSolanaAddressMessage,
};
