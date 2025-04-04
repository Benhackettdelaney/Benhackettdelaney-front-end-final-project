//h
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const fetchReviews = async (movieId, token) => {
  const response = await axios.get(`${BASE_URL}/reviews/movie/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.reviews; 
};

export const createReview = async (movieId, content, token) => {
  const response = await axios.post(
    `${BASE_URL}/reviews/create`,
    { movie_id: movieId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
};

export const updateReview = async (reviewId, content, token) => {
  const response = await axios.put(
    `${BASE_URL}/reviews/update/${reviewId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
};

export const deleteReview = async (reviewId, token) => {
  await axios.delete(`${BASE_URL}/reviews/delete/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
