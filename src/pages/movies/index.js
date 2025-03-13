// src/pages/movies/All.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function All({ authenticated }) {
  // Add authenticated prop
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view movies");
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:5000/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Movies</h2>
      {error && <p className="text-red-500">{error}</p>}
      {authenticated && (
        <Link
          to="/movies/create"
          className="bg-green-500 text-white p-2 rounded mb-4 inline-block"
        >
          Create New Movie
        </Link>
      )}
      <ul className="space-y-4">
        {movies.map((movie) => (
          <li key={movie.id} className="p-4 bg-white rounded shadow">
            <p>
              <Link
                to={`/movies/${movie.id}`}
                className="text-blue-500 hover:underline"
              >
                <strong>{movie.movie_title}</strong>
              </Link>{" "}
              ({movie.movie_genres})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default All;
