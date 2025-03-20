import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000"; 

export const fetchCurrentUser = async (token) => {
  const response = await axios.get(`${BASE_URL}/auth/current-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchMovie = async (movieId, token) => {
  const response = await axios.get(`${BASE_URL}/movies/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAllMovies = async (token) => {
  const response = await axios.get(`${BASE_URL}/movies`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createMovie = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/movies/create`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateMovie = async (movieId, formData, token) => {
  const response = await axios.put(
    `${BASE_URL}/movies/update/${movieId}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteMovie = async (movieId, token) => {
  await axios.delete(`${BASE_URL}/movies/delete/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchWatchlists = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/watchlists`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateWatchlist = async (watchlistId, userId, movieId, token) => {
  const response = await axios.put(
    `${BASE_URL}/watchlists/update/${watchlistId}`,
    { user_id: userId, movie_id: movieId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const createRating = async (userId, movieId, rating, token) => {
  await axios.post(
    `${BASE_URL}/ratings`,
    { user_id: userId, movie_id: movieId, rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

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
