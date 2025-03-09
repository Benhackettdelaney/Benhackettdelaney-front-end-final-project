import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MovieSingle() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const userId = localStorage.getItem("userId"); // No setter needed if not updating
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/movies/${movieId}`,
          { withCredentials: true }
        );
        setMovie(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch movie");
      }
    };

    fetchMovie();

    if (!userId) {
      setError("Please log in to view this page");
      navigate("/");
    }
  }, [movieId, userId, navigate]); // Dependencies include userId and navigate

  const handleAddToWatchlist = async () => {
    if (!userId) {
      setError("Please log in to add to watchlist");
      navigate("/");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:5000/watchlist",
        {
          movie_id: movieId,
          title: movie.movie_title,
        },
        { withCredentials: true }
      );
      alert("Added to watchlist!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to watchlist");
    }
  };

  const handleRate = async (rating) => {
    if (!userId) {
      setError("Please log in to rate movies");
      navigate("/");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:5000/ratings",
        {
          user_id: userId,
          movie_id: movieId,
          rating,
        },
        { withCredentials: true }
      );
      alert("Rating submitted!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rate movie");
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-4 bg-white rounded shadow">
        <p>
          <strong>{movie.movie_title}</strong> ({movie.movie_genres})
        </p>
        <button
          onClick={handleAddToWatchlist}
          className="bg-blue-500 text-white p-1 rounded mr-2"
        >
          Add to Watchlist
        </button>
        <select
          onChange={(e) => handleRate(parseFloat(e.target.value))}
          className="p-1 border rounded"
        >
          <option value="">Rate</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MovieSingle;
