import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWatchlist, updateWatchlist } from "../../apis/watchlist";
import { fetchMovie } from "../../apis/movie";

function WatchlistSingle({ authenticated }) {
  const { watchlistId } = useParams();
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [newMovieId, setNewMovieId] = useState("");
  const [movieToRemove, setMovieToRemove] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const deleteMovieModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!watchlistId || !userId || !token || !authenticated) {
      setError("Please log in or provide a valid watchlist ID");
      navigate("/");
      return;
    }

    const loadWatchlist = async () => {
      try {
        const watchlistData = await fetchWatchlist(watchlistId, userId, token);
        setWatchlistItem(watchlistData);

        const moviePromises = watchlistData.movie_ids.map((movieId) =>
          fetchMovie(movieId, token)
        );
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (err) {
        console.error("Fetch watchlist error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch watchlist item");
      }
    };

    loadWatchlist();
  }, [watchlistId, userId, navigate, token, authenticated]);

  const handleRemoveMovie = (movieIdToRemove) => {
    setMovieToRemove(movieIdToRemove);
    deleteMovieModalRef.current.showModal();
  };

  const confirmRemoveMovie = async () => {
    if (!movieToRemove) return;
    try {
      await updateWatchlist(
        watchlistId,
        { user_id: userId, remove_movie_id: movieToRemove },
        token
      );
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: prev.movie_ids.filter((id) => id !== movieToRemove),
      }));
      setMovies((prev) => prev.filter((movie) => movie.id !== movieToRemove));
      setMovieToRemove(null);
      deleteMovieModalRef.current.close();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove movie");
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility = !watchlistItem.is_public;
    try {
      await updateWatchlist(
        watchlistId,
        { user_id: userId, is_public: newVisibility },
        token
      );
      setWatchlistItem((prev) => ({
        ...prev,
        is_public: newVisibility,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update visibility");
    }
  };

  const handleAddMovie = async () => {
    if (!newMovieId) {
      setError("Please enter a movie ID to add.");
      return;
    }

    try {
      await updateWatchlist(
        watchlistId,
        { user_id: userId, movie_id: newMovieId },
        token
      );
      const newMovie = await fetchMovie(newMovieId, token);
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: [...prev.movie_ids, newMovieId],
      }));
      setMovies((prev) => [...prev, newMovie]);
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

  if (!watchlistItem) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10 p-10">
      {error && <p className="text-red-500 mb-6">{error}</p>}
      <div className="p-8 bg-gray-800 rounded shadow text-white">
        <h2 className="text-2xl mb-8">{watchlistItem.title}</h2>
        <p>
          Visibility: {watchlistItem.is_public ? "Public" : "Private"}
          {authenticated && (
            <button
              onClick={handleToggleVisibility}
              className="ml-4 bg-blue-500 text-white p-1 rounded"
            >
              {watchlistItem.is_public ? "Make Private" : "Make Public"}
            </button>
          )}
        </p>
        <p className="mt-4 pb-5">Movies in this watchlist:</p>
        {movies.length > 0 ? (
          <ul className="space-y-8">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="p-8 bg-gray-700 rounded shadow flex justify-between items-center"
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
          <p className="mt-4">No movies in this watchlist yet.</p>
        )}

        {authenticated && (
          <div className="mt-8 flex space-x-6">
            <input
              type="text"
              value={newMovieId}
              onChange={(e) => setNewMovieId(e.target.value)}
              placeholder="Enter Movie ID to add"
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddMovie}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Movie
            </button>
          </div>
        )}

        {authenticated && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate(`/watchlist/${watchlistId}/edit`)}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Edit Watchlist
            </button>
          </div>
        )}
        <button
          onClick={() => navigate("/watchlist")}
          className="bg-gray-500 text-white p-2 rounded mt-8"
        >
          Back to Watchlist
        </button>
      </div>
      <dialog
        id="delete_movie_modal"
        className="modal"
        ref={deleteMovieModalRef}
      >
        <div className="modal-box p-8">
          <h3 className="text-lg font-bold">Confirm Removal</h3>
          <p className="py-4">
            Are you sure you want to remove this movie from the watchlist?
          </p>
          <div className="modal-action">
            <button onClick={confirmRemoveMovie} className="btn btn-error mr-2">
              Yes, Remove
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default WatchlistSingle;
