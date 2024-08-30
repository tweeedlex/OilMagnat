import apiRequest from "./config";

export const getCurrency = async () => {
	return await apiRequest("GET", "/transferMarket");
};

export const changeOil = async (oilAmount) => {
	return await apiRequest("POST", "/transferMarket/changeOil", {}, { oilAmount });
};
