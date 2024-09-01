import apiRequest from "./config";
import { setUser } from "../store/slice";

export const auth = async (dispatch) => {
	// let initData = window.Telegram.WebApp.initData
	// if (import.meta.env.VITE_DEBUG_AUTH) {
	// 	initData = import.meta.env.VITE_INIT_DATA
	// }
	let initData =
		"query_id=AAFx6aZoAAAAAHHppmjD_t4J&user=%7B%22id%22%3A1755769201%2C%22first_name%22%3A%22%D0%92%D0%BB%D0%B0%D0%B4%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Vobyyy%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725192598&hash=716b9ddba5c7abb5d9421078f911be6a436c1ddb1ec69a26ce06ebb8dc7c34db";
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
