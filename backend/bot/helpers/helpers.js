function idToString(id) {
	return id.toString().split(".")[0];
}

function generateReferralCode() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const codeLength = 8;
	let code = "";

	for (let i = 0; i < codeLength; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters.charAt(randomIndex);
	}

	return code;
}

module.exports = {
	idToString,
	generateReferralCode,
};
