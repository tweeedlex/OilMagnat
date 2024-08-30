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
const getWorkersPrice = (workerLevel) => {
	let workerPrice = 0;

	switch (workerLevel) {
		case 1:
			workerPrice = 200;
			break;
		case 2:
			workerPrice = 400;
			break;
		case 3:
			workerPrice = 800;
			break;
		case 4:
			workerPrice = 1600;
			break;
		case 5:
			workerPrice = 3200;
			break;
	}
	return workerPrice;
};

module.exports = { getTraderWorkerBonus, getWorkersPrice };
