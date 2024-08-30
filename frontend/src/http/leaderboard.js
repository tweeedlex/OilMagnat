import apiRequest from "./config";

export const getLeaderboard = async () => {
  return await apiRequest("GET", "/leaderboard");
}