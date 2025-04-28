
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const fetchAllActors = async (token) => {
  const response = await axios.get(`${BASE_URL}/actors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchActor = async (actorId, token) => {
  const response = await axios.get(`${BASE_URL}/actors/${actorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createActor = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/actors`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateActor = async (actorId, formData, token) => {
  const response = await axios.put(`${BASE_URL}/actors/${actorId}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteActor = async (actorId, token) => {
  await axios.delete(`${BASE_URL}/actors/${actorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addActorToMovie = async (movieId, actorId, token) => {
  const response = await axios.post(
    `${BASE_URL}/movies/${movieId}/actors`,
    { actor_id: actorId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const removeActorFromMovie = async (movieId, actorId, token) => {
  const response = await axios.delete(
    `${BASE_URL}/actors/movies/${movieId}/actors/${actorId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
