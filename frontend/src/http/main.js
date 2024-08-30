import apiRequest from "./config";

export const getMainPageInfo = async () => {
  return await apiRequest("GET", "/mainPage");
}