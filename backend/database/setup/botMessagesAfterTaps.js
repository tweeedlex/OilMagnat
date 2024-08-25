const setupAfterTapsBotMessages = async (db) => {
	try {
		const existingMessages = await db.SendMessage.find();
		let settings = await db.Settings.findOne({});

		let newMessages = [];

		// Видаляємо зайві елементи які починаються на 'refferal'
		for (const message of existingMessages) {
			if (
				message.type.startsWith("refferal") &&
				!settings.broadcastAfterTaps.includes(parseInt(message.type.replace("refferal", ""), 10))
			) {
				await db.SendMessage.deleteOne({ _id: message._id });
				console.log(`Removed element from SendMessage with type: ${message.type}`);
			}
		}

		// додаємо нові записи якшо їх не вистачає
		if (settings.broadcastAfterTaps && settings.broadcastAfterTaps.length > 0) {
			settings.broadcastAfterTaps.forEach((tap, i) => {
				const expectedType = `refferal${tap}`;
				const hasType = existingMessages.some((message) => message.type === expectedType);
				if (!hasType) {
					let messageObject = {
						type: `refferal${tap}`,
						messages: setupAfterTapsMessages(settings.broadcastAfterTaps, i),
					};
					console.log(`Created element for SendMessage with type: refferal${tap}`);
					newMessages.push(messageObject);
				}
			});
		}

		// створюємо нові записи
		if (newMessages.length > 0) {
			for (const message of newMessages) {
				await db.SendMessage.create(message);
			}
			console.log("SendMessage collection was filled with default messages for broadcastAfterTaps");
		} else {
			console.log("SendMessage collection does not need to be updated for broadcastAfterTaps");
		}
	} catch (error) {
		console.error("Error setting up bot messages:", error);
	}
};

module.exports = { setupAfterTapsBotMessages };

function setupAfterTapsMessages(tapsArray, elNumberInArray) {
	let messageArr = [];
	if (elNumberInArray == 1 || tapsArray[elNumberInArray] == 100) {
		messageArr = [
			"Hey there! 🎉 You’ve tapped {counttaps} times! Invite a friend and you both get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Plus, earn up to {maxrefpercent}% of their taps!",
			"Hi! 🌟 Awesome job with {counttaps} taps! Share with friends and receive {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Also, get up to {maxrefpercent}% of their taps!",
			"Hello! 👯‍♂️ With {counttaps} taps, you’re on fire! Invite a friend and enjoy {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their activity!",
		];
	} else if (elNumberInArray == 2 || tapsArray[elNumberInArray] == 1000) {
		messageArr = [
			"Greetings! 🚀 You’ve reached {counttaps} taps! Invite friends now and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Plus, earn up to {maxrefpercent}% of their taps!",
			"Hey! 🤩 Fantastic work with {counttaps} taps! Share the game and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their taps!",
			"Hi there! 🌟 {counttaps} taps and counting! Invite friends and receive {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their taps!",
		];
	} else if (elNumberInArray == 3 || tapsArray[elNumberInArray] == 5000) {
		messageArr = [
			"Hello! 🎊 {counttaps} taps is impressive! Invite friends and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Plus, earn up to {maxrefpercent}% of their taps!",
			"Hey there! 🌟 You’ve hit {counttaps} taps! Share with friends and receive {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their activity!",
			"Greetings! 👯‍♂️ Amazing! With {counttaps} taps, inviting friends will earn both of you {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their taps!",
		];
	} else if (elNumberInArray == 4 || tapsArray[elNumberInArray] == 10000) {
		messageArr = [
			"Hi! 🌟 {counttaps} taps is fantastic! Invite friends and enjoy {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Plus, get up to {maxrefpercent}% of their taps!",
			"Hello! 🎉 You’ve tapped {counttaps} times! Share with friends and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their activity!",
			"Hey! 👋 Great job with {counttaps} taps! Invite friends now and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their taps!",
		];
	} else if (elNumberInArray == 4 || tapsArray[elNumberInArray] == 30000) {
		messageArr = [
			"Greetings! 🌟 {counttaps} taps is incredible! Invite friends and receive {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium). Earn up to {maxrefpercent}% of their taps as well!",
			"Hey there! 🎉 You’ve hit {counttaps} taps! Share with friends and get {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus {maxrefpercent}% of their activity!",
			"Hello! 👯‍♂️ Amazing achievement with {counttaps} taps! Invite friends and enjoy {referralReward} tokens (basic) or {referralRewardPremium} tokens (premium), plus up to {maxrefpercent}% of their taps!",
		];
	}

	return messageArr;
}
