import axios from "axios";

// Base URL for the API
const BASE_URL = "http://127.0.0.1:5000";

// Fetch all actors with authorization token
export const fetchAllActors = async (token) => {
  const response = await axios.get(`${BASE_URL}/actors`, {
    headers: { Authorization: `Bearer ${token}` }, // Include token for auth
  });
  return response.data; // Return the data of all actors
};

// Fetch a single actor by their ID with authorization token
export const fetchActor = async (actorId, token) => {
  const response = await axios.get(`${BASE_URL}/actors/${actorId}`, {
    headers: { Authorization: `Bearer ${token}` }, // Include token for auth
  });
  return response.data;
};

// Create a new actor with the provided data and authorization token
export const createActor = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/actors`, formData, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token for auth
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Update an existing actor's data using their ID and authorization token
export const updateActor = async (actorId, formData, token) => {
  const response = await axios.put(`${BASE_URL}/actors/${actorId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token for auth
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Delete an actor by their ID with authorization token
export const deleteActor = async (actorId, token) => {
  await axios.delete(`${BASE_URL}/actors/${actorId}`, {
    headers: { Authorization: `Bearer ${token}` }, // Include token for auth
  });
};

// Add an actor to a movie using the movie and actor IDs, with authorization token
export const addActorToMovie = async (movieId, actorId, token) => {
  const response = await axios.post(
    `${BASE_URL}/movies/${movieId}/actors`,
    { actor_id: actorId },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include token for auth
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Remove an actor from a movie using the movie and actor IDs, with authorization token
export const removeActorFromMovie = async (movieId, actorId, token) => {
  const response = await axios.delete(
    `${BASE_URL}/movies/${movieId}/actors/${actorId}`,
    {
      headers: { Authorization: `Bearer ${token}` }, // Include token for auth
    }
  );
  return response.data;
};

export const fetchCountries = async (token) => {
  const response = await axios.get(`${BASE_URL}/actors/countries`, {
    headers: { Authorization: `Bearer ${token}` }, // Include token for auth
  });
  return response.data;
};
