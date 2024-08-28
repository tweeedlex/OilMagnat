import apiRequest from "./config";
import {setUser} from "../store/slice";

export const auth = async (dispatch) => {
	console.log(window.Telegram.WebApp.initData);
	const response = await apiRequest("POST", "/user/auth", {}, { initData: window.Telegram.WebApp.initData });
	console.log(response)
	localStorage.setItem("token", response.token);
	localStorage.setItem("expiresIn", response.expiresIn);
	dispatch(setUser(response.user));
	return response;
};

export const getUser = async () => {
	return await apiRequest("GET", "/user");
};
