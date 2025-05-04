import axios from "axios";

// Base URL for the API
const BASE_URL = "http://127.0.0.1:5000";

// Create a new rating for a movie by the user
export const createRating = async (userId, movieId, rating, token) => {
  const response = await axios.post(
    `${BASE_URL}/ratings`,
    { user_id: userId, movie_id: movieId, rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );  
  return response.data;
};

// Fetch all ratings for a user
export const fetchUserRatings = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/ratings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an existing rating by its ID
export const updateRating = async (ratingId, rating, token) => {
  const response = await axios.put(
    `${BASE_URL}/ratings/${ratingId}`,
    { rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete a rating by its ID
export const deleteRating = async (ratingId, token) => {
  const response = await axios.delete(`${BASE_URL}/ratings/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
