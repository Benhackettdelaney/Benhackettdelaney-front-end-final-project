// src/apis/watchlist.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const createWatchlist = async (formData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/watchlists/create`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create watchlist" };
  }
};

export const fetchWatchlists = async (userId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/watchlists`, {
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch watchlists" };
  }
};

export const fetchWatchlist = async (watchlistId, userId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/watchlists/${watchlistId}`, {
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        error: `Failed to fetch watchlist ${watchlistId}`,
      }
    );
  }
};

export const updateWatchlist = async (watchlistId, data, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/watchlists/update/${watchlistId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        error: `Failed to update watchlist ${watchlistId}`,
      }
    );
  }
};

export const deleteWatchlist = async (watchlistId, userId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/watchlists/delete/${watchlistId}`,
      {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Return response.data for consistency
  } catch (error) {
    throw (
      error.response?.data || {
        error: `Failed to delete watchlist ${watchlistId}`,
      }
    );
  }
};

export const fetchPublicWatchlists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/watchlists/public`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch public watchlists" }
    );
  }
};
