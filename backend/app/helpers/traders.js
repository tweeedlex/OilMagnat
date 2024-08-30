const getTraderWorkerBonus = (workerLevel) => {
	let workerBonus = 0;

	switch (workerLevel) {
		case 1:
			workerBonus = 2;
			break;
		case 2:
			workerBonus = 4;
			break;
		case 3:
			workerBonus = 8;
			break;
		case 4:
			workerBonus = 16;
			break;
		case 5:
			workerBonus = 100;
			break;
	}
	return workerBonus;
};

module.exports = { getTraderWorkerBonus };
