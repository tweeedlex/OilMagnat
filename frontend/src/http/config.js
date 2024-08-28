import axios from "axios";
import { getUser } from "./user";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
	config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
	return config;
});

const apiRequest = async (method, route, options = {}, body = null) => {
	try {
		const config = { ...options };
		if (body) {
			config.data = body;
		}
		const response = await api.request({
			method,
			url: route,
			...config,
		});
		return response.data;
	} catch (e) {
		return { error: e, status: e.response?.status, data: e.response?.data };
	}
};

export default apiRequest;
