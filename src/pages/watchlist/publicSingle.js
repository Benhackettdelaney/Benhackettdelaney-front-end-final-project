import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Using axios directly for public fetch

function PublicWatchlistSingle({ authenticated }) {
  const { id: watchlistId } = useParams(); // Renamed to avoid confusion
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newMovieId, setNewMovieId] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPublicWatchlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/watchlists/public/${watchlistId}`
        );
        setWatchlistItem(response.data);
      } catch (err) {
        console.error("Fetch public watchlist error:", err.response?.data);
        setError(
          err.response?.data?.error || "Failed to fetch public watchlist"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPublicWatchlist();
  }, [watchlistId]);

  const handleRemoveMovie = async (movieIdToRemove) => {
    if (!authenticated || !userId || !token) {
      setError("Please log in to remove movies from this watchlist");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to remove "${movieIdToRemove}" from this watchlist?`
      )
    )
      return;

    try {
      await axios.put(
        `http://localhost:5000/watchlists/update/${watchlistId}`,
        { user_id: userId, remove_movie_id: movieIdToRemove },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: prev.movie_ids.filter((id) => id !== movieIdToRemove),
        movies: prev.movies.filter((movie) => movie.id !== movieIdToRemove),
      }));
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove movie");
    }
  };

  const handleToggleVisibility = async () => {
    if (!authenticated || !userId || !token) {
      setError("Please log in to change watchlist visibility");
      return;
    }
    const newVisibility = !watchlistItem.is_public;
    try {
      await axios.put(
        `http://localhost:5000/watchlists/update/${watchlistId}`,
        { user_id: userId, is_public: newVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlistItem((prev) => ({
        ...prev,
        is_public: newVisibility,
      }));
      setError("");
      alert(`Watchlist is now ${newVisibility ? "public" : "private"}!`);
    } catch (err) {
      console.error("Toggle visibility error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update visibility");
    }
  };

  const handleAddMovie = async () => {
    if (!authenticated || !userId || !token) {
      setError("Please log in to add movies to this watchlist");
      return;
    }
    if (!newMovieId) {
      setError("Please enter a movie ID to add.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/watchlists/update/${watchlistId}`,
        { user_id: userId, movie_id: newMovieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMovieResponse = await axios.get(
        `http://localhost:5000/movies/${newMovieId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newMovie = newMovieResponse.data;
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: [...prev.movie_ids, newMovieId],
        movies: [
          ...prev.movies,
          {
            id: newMovie.id,
            title: newMovie.movie_title,
            genres: newMovie.movie_genres,
          },
        ],
      }));
      setNewMovieId("");
      setError("");
    } catch (err) {
      console.error("Add movie error:", err.response?.data);
      if (err.response?.status === 409) {
        setError("This movie is already in the watchlist.");
      } else if (err.response?.status === 404) {
        setError("Movie not found.");
      } else {
        setError(err.response?.data?.error || "Failed to add movie");
      }
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;
  if (error)
    return <div className="container mx-auto mt-10 text-red-500">{error}</div>;
  if (!watchlistItem)
    return <div className="container mx-auto mt-10">Watchlist not found</div>;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">
        {watchlistItem.title}
      </h2>
      <p className="text-gray-600">By: {watchlistItem.username}</p>
      <p className="text-gray-600">
        Visibility: {watchlistItem.is_public ? "Public" : "Private"}
        {authenticated && watchlistItem.user_id === parseInt(userId) && (
          <button
            onClick={handleToggleVisibility}
            className="ml-4 bg-blue-500 text-white p-1 rounded"
          >
            {watchlistItem.is_public ? "Make Private" : "Make Public"}
          </button>
        )}
      </p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Movies in this Watchlist</h3>
        {watchlistItem.movies && watchlistItem.movies.length > 0 ? (
          <ul className="space-y-4">
            {watchlistItem.movies.map((movie) => (
              <li
                key={movie.id}
                className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{movie.title}</strong> ({movie.genres})
                </div>
                {authenticated &&
                  watchlistItem.user_id === parseInt(userId) && (
                    <button
                      onClick={() => handleRemoveMovie(movie.id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Remove
                    </button>
                  )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No movies in this watchlist yet.</p>
        )}
      </div>

      {authenticated && watchlistItem.user_id === parseInt(userId) && (
        <div className="mt-4">
          <input
            type="text"
            value={newMovieId}
            onChange={(e) => setNewMovieId(e.target.value)}
            placeholder="Enter Movie ID to add"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddMovie}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Movie
          </button>
        </div>
      )}

      {authenticated && watchlistItem.user_id === parseInt(userId) && (
        <button
          onClick={() => navigate(`/watchlist/${watchlistId}/edit`)}
          className="bg-yellow-500 text-white p-2 rounded mr-2 mt-4"
        >
          Edit Watchlist
        </button>
      )}
      <Link to="/public-watchlists" className="btn btn-neutral mt-6">
        Back to Public Watchlists
      </Link>
    </div>
  );
}

export default PublicWatchlistSingle;
