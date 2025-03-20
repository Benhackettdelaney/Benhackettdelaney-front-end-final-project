// src/apis/watchlist.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const createWatchlist = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/watchlists/create`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchWatchlists = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/watchlists`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchWatchlist = async (watchlistId, userId, token) => {
  const response = await axios.get(`${BASE_URL}/watchlists/${watchlistId}`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateWatchlist = async (watchlistId, data, token) => {
  const response = await axios.put(
    `${BASE_URL}/watchlists/update/${watchlistId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteWatchlist = async (watchlistId, userId, token) => {
  await axios.delete(`${BASE_URL}/watchlists/delete/${watchlistId}`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchPublicWatchlists = async () => {
  const response = await axios.get(`${BASE_URL}/watchlists/public`);
  return response.data;
};
