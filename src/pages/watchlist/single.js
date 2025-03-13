// src/pages/watchlist/single.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function WatchlistSingle({ authenticated }) {
  const { watchlistId } = useParams();
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [movies, setMovies] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!watchlistId || !userId || !token || !authenticated) {
      setError("Please log in or provide a valid watchlist ID");
      navigate("/");
      return;
    }

    const fetchWatchlistItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/watchlists/${watchlistId}`,
          {
            params: { user_id: userId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Watchlist item response:", response.data);
        setWatchlistItem(response.data);

        const moviePromises = response.data.movie_ids.map((movieId) =>
          axios.get(`http://localhost:5000/movies/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          })
        );
        const movieResponses = await Promise.all(moviePromises);
        const movieData = movieResponses.map((res) => res.data);
        console.log("Movie data:", movieData);
        setMovies(movieData);
      } catch (err) {
        console.error("Fetch watchlist error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch watchlist item");
      }
    };

    fetchWatchlistItem();
  }, [watchlistId, userId, navigate, token, authenticated]);

  const handleRemoveMovie = async (movieIdToRemove) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${movieIdToRemove}" from this watchlist?`
      )
    )
      return;

    try {
      const response = await axios.put(
        `http://localhost:5000/watchlists/update/${watchlistId}`,
        { user_id: userId, remove_movie_id: movieIdToRemove },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log("Remove movie response:", response.data);
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: prev.movie_ids.filter((id) => id !== movieIdToRemove),
      }));
      setMovies((prev) => prev.filter((movie) => movie.id !== movieIdToRemove));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove movie");
    }
  };

  if (!watchlistItem) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">{watchlistItem.title}</h2>
        <p>Movies in this watchlist:</p>
        {movies.length > 0 ? (
          <ul className="space-y-4">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{movie.movie_title}</strong> ({movie.movie_genres})
                </div>
                <button
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies in this watchlist yet.</p>
        )}

        {authenticated && (
          <button
            onClick={() => navigate(`/watchlist/${watchlistId}/edit`)}
            className="bg-yellow-500 text-white p-2 rounded mr-2 mt-4"
          >
            Edit Watchlist
          </button>
        )}
        <button
          onClick={() => navigate("/watchlist")}
          className="bg-gray-500 text-white p-2 rounded mt-4"
        >
          Back to Watchlist
        </button>
      </div>
    </div>
  );
}

export default WatchlistSingle;
