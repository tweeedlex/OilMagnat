import apiRequest from "./config";

export const getMarketInfo = async () => {
	return await apiRequest("GET", "/transferMarket");
};

export const changeOil = async (oilAmount) => {
	return await apiRequest("POST", "/transferMarket/changeOil", {}, { oilAmount });
};

export const buyUSD = async (USDAmount) => {
	return await apiRequest("POST", "/transferMarket/buyUSD", {}, { USDAmount });
}