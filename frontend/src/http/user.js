import apiRequest from "./config";
import { setUser } from "../store/slice";

export const auth = async (dispatch) => {
	let initData = window.Telegram.WebApp.initData;
	if (import.meta.env.VITE_DEBUG_AUTH === "true") {
		initData = import.meta.env.VITE_INIT_DATA;
	}
	console.log(initData);
	const response = await apiRequest("POST", "/user/auth", {}, { initData });
	console.log(response);
	localStorage.setItem("token", response.token);
	localStorage.setItem("expiresIn", response.expiresIn);
	dispatch(setUser(response.user));
	return response;
};

export const getUser = async () => {
	return await apiRequest("GET", "/user");
};
