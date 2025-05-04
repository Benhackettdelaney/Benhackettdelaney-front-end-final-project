import axios from "axios";

// Base URL for the API
const BASE_URL = "http://127.0.0.1:5000";

// Fetch all reviews for a specific movie
export const fetchReviews = async (movieId, token) => {
  const response = await axios.get(`${BASE_URL}/reviews/movie/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.reviews; 
};

// Create a new review for a movie
export const createReview = async (movieId, content, token) => {
  const response = await axios.post(
    `${BASE_URL}/reviews/create`,
    { movie_id: movieId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
};

// Update an existing review by its ID
export const updateReview = async (reviewId, content, token) => {
  const response = await axios.put(
    `${BASE_URL}/reviews/update/${reviewId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
};

// Delete a review by its ID
export const deleteReview = async (reviewId, token) => {
  await axios.delete(`${BASE_URL}/reviews/delete/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
