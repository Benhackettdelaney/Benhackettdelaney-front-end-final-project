import axios from "axios";

// Base URL for the API
const BASE_URL = "http://127.0.0.1:5000";

// Fetch the current logged-in user using the token for authorization
export const fetchCurrentUser = async (token) => {
  const response = await axios.get(`${BASE_URL}/auth/current-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch a specific movie by its ID using the token for authorization
export const fetchMovie = async (movieId, token) => {
  const response = await axios.get(`${BASE_URL}/movies/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch all movies using the token for authorization
export const fetchAllMovies = async (token) => {
  const response = await axios.get(`${BASE_URL}/movies`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new movie using provided data and token for authorization
export const createMovie = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/movies/create`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an existing movie by its ID using provided data and token for authorization
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

// Delete a movie by its ID using the token for authorization
export const deleteMovie = async (movieId, token) => {
  await axios.delete(`${BASE_URL}/movies/delete/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Fetch a user's watchlist using the user ID and token for authorization
export const fetchWatchlists = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/watchlists`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a watchlist with a new movie using the watchlist ID, user ID, and token
export const updateWatchlist = async (watchlistId, userId, movieId, token) => {
  const response = await axios.put(
    `${BASE_URL}/watchlists/update/${watchlistId}`,
    { user_id: userId, movie_id: movieId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Create a rating for a movie by the user, passing movie ID, user ID, rating, and token
export const createRating = async (userId, movieId, rating, token) => {
  await axios.post(
    `${BASE_URL}/ratings`,
    { user_id: userId, movie_id: movieId, rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Fetch all reviews for a movie by its ID and token for authorization
export const fetchReviews = async (movieId, token) => {
  const response = await axios.get(`${BASE_URL}/reviews/movie/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.reviews;
};

// Create a new review for a movie by its ID, with review content and token
export const createReview = async (movieId, content, token) => {
  const response = await axios.post(
    `${BASE_URL}/reviews/create`,
    { movie_id: movieId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Update an existing review by its ID, with new content and token for authorization
export const updateReview = async (reviewId, content, token) => {
  const response = await axios.put(
    `${BASE_URL}/reviews/update/${reviewId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete a review by its ID using the token for authorization
export const deleteReview = async (reviewId, token) => {
  await axios.delete(`${BASE_URL}/reviews/delete/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
