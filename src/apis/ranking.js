// src/apis/ranking.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const fetchTopRankedMovies = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/ranking`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
