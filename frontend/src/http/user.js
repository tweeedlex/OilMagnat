import apiRequest from "./config";

export const auth = async () => {
  const response = await apiRequest("POST", "/user/auth", {}, {initData: window.Telegram.WebApp.initData});
  localStorage.setItem("token", response.token);
  localStorage.setItem("expiresIn", response.expiresIn);
  return response;
}

export const getUser = async () => {
  return await apiRequest("GET", "/user");
}