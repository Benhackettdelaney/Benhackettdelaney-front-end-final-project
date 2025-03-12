import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MovieEdit() {
  const { movieId } = useParams();
  const [formData, setFormData] = useState({
    movie_title: "",
    movie_genres: "",
  });
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId || !userId) {
      setError("Please log in or provide a valid movie ID");
      navigate("/");
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/movies/${movieId}`,
          { withCredentials: true }
        );
        setFormData({
          movie_title: response.data.movie_title,
          movie_genres: response.data.movie_genres,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch movie");
      }
    };

    fetchMovie();
  }, [movieId, userId, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:5000/movies/update/${movieId}`,
        formData,
        { withCredentials: true }
      );
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update movie");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Edit Movie</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="movie_title"
          placeholder="Movie Title"
          value={formData.movie_title}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          name="movie_genres"
          placeholder="Genres (comma-separated)"
          value={formData.movie_genres}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Update Movie
        </button>
      </form>
      <button
        onClick={() => navigate("/movies")}
        className="bg-gray-500 text-white p-2 rounded"
      >
        Back to Movies
      </button>
    </div>
  );
}

export default MovieEdit;
