// src/pages/movies/create.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MovieCreate({ authenticated }) {
  const [formData, setFormData] = useState({
    id: "",
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

    const checkUserRole = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/auth/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsAdmin(response.data.role === "admin");
      } catch (err) {
        console.error("Failed to fetch current user:", err.response?.data);
        setError("Please log in to continue");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, [navigate, authenticated]);

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
      setError("Only admins can create movies");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/movies/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Movie create response:", response.data);
      setFormData({
        id: "",
        movie_title: "",
        movie_genres: "",
        description: "",
      }); // Reset description too
      setError("");
      navigate("/movies");
    } catch (err) {
      console.error("Movie create error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create movie");
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Create New Movie</h2>
      {error && <p className="text-red-500">{error}</p>}
      {!isAdmin || !authenticated ? (
        <p className="text-red-500">
          You must be an admin to create movies. Please log in with an admin
          account.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            name="id"
            placeholder="Movie ID (e.g., tt1234567)"
            value={formData.id}
            onChange={handleChange}
            className="p-2 border rounded w-full max-w-md"
            required
          />
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
            Create Movie
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

export default MovieCreate;
