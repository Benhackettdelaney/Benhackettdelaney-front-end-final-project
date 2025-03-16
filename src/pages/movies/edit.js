import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MovieEdit({ authenticated }) {
  const { movieId } = useParams();
  const [formData, setFormData] = useState({
    movie_title: "",
    movie_genres: "",
    description: "", 
  });
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !authenticated) {
      setError("Please log in to continue");
      setLoading(false);
      navigate("/");
      return;
    }

    const checkUserRoleAndFetchMovie = async () => {
      try {
        const userResponse = await axios.get(
          "http://127.0.0.1:5000/auth/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsAdmin(userResponse.data.role === "admin");

        const movieResponse = await axios.get(
          `http://127.0.0.1:5000/movies/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData({
          movie_title: movieResponse.data.movie_title,
          movie_genres: movieResponse.data.movie_genres,
          description: movieResponse.data.description || "", 
        });
      } catch (err) {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load movie data");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!movieId) {
      setError("No movie ID provided");
      setLoading(false);
      navigate("/movies");
      return;
    }

    checkUserRoleAndFetchMovie();
  }, [movieId, navigate, authenticated]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!isAdmin || !authenticated) {
      setError("Only admins can edit movies");
      return;
    }
    try {
      await axios.put(
        `http://127.0.0.1:5000/movies/update/${movieId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      navigate("/movies");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update movie");
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Edit Movie</h2>
      {error && <p className="text-red-500">{error}</p>}
      {!isAdmin || !authenticated ? (
        <p className="text-red-500">
          You must be an admin to edit movies. Please log in with an admin
          account.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            name="movie_title"
            placeholder="Movie Title"
            value={formData.movie_title}
            onChange={handleChange}
            className="p-2 border rounded w-full max-w-md"
            required
          />
          <input
            type="text"
            name="movie_genres"
            placeholder="Genres (comma-separated)"
            value={formData.movie_genres}
            onChange={handleChange}
            className="p-2 border rounded w-full max-w-md"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded w-full max-w-md h-24"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Update Movie
          </button>
        </form>
      )}
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
