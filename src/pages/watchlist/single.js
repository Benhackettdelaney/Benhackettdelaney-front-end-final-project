import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWatchlist, updateWatchlist } from "../../apis/watchlist";
import { fetchMovie } from "../../apis/movie";

function WatchlistSingle({ authenticated }) {
  // Get watchlist ID from URL params
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
    // Checks if the data exists
    if (!watchlistId || !userId || !token || !authenticated) {
      setError("Please log in or provide a valid watchlist ID");
      navigate("/"); // Navigate to home if conditions aren't met
      return;
    }

    const loadWatchlist = async () => {
      try {
        // Fetch the watchlist data
        const watchlistData = await fetchWatchlist(watchlistId, userId, token);
        setWatchlistItem(watchlistData);

        // Fetch all movies in the watchlist using movie IDs
        const moviePromises = watchlistData.movie_ids.map((movieId) =>
          fetchMovie(movieId, token)
        );
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData); // Store the movie data
      } catch (err) {
        console.error("Fetch watchlist error:", err);
        setError(err.response?.data?.error || "Failed to fetch watchlist item");
      }
    };

    // Call function to load watchlist and movies
    loadWatchlist();
  }, [watchlistId, userId, navigate, token, authenticated]);

  // Handle removing a movie from the watchlist
  const handleRemoveMovie = (movieIdToRemove) => {
    setMovieToRemove(movieIdToRemove);
    // Show confirmation modal
    deleteMovieModalRef.current.showModal();
  };

  // Confirm removal of a movie
  const confirmRemoveMovie = async () => {
    // No movie to remove
    if (!movieToRemove) return;
    try {
      // Update watchlist by removing the selected movie
      await updateWatchlist(
        watchlistId,
        { user_id: userId, remove_movie_id: movieToRemove },
        token
      );
      // Update state to reflect the removed movie
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: prev.movie_ids.filter((id) => id !== movieToRemove),
      }));
      setMovies((prev) => prev.filter((movie) => movie.id !== movieToRemove));
      setMovieToRemove(null); // Reset removal state
      deleteMovieModalRef.current.close(); // Close modal
      setError("");
    } catch (err) {
      console.error("Remove movie error:", err);
      setError(err.response?.data?.error || "Failed to remove movie");
    }
  };

  // Toggle visibility of the watchlist
  const handleToggleVisibility = async () => {
    const newVisibility = !watchlistItem.is_public; // Toggle visibility
    try {
      // Update watchlist visibility
      await updateWatchlist(
        watchlistId,
        { user_id: userId, is_public: newVisibility },
        token
      );
      setWatchlistItem((prev) => ({
        ...prev,
        is_public: newVisibility,
      })); // Update state
    } catch (err) {
      console.error("Toggle visibility error:", err);
      setError(err.response?.data?.error || "Failed to update visibility");
    }
  };

  // Add a new movie to the watchlist
  const handleAddMovie = async () => {
    if (!newMovieId) {
      // Show error if no movie ID
      setError("Please enter a movie ID to add.");
      return;
    }

    try {
      // Update watchlist with new movie
      await updateWatchlist(
        watchlistId,
        { user_id: userId, movie_id: newMovieId },
        token
      );
      // Fetch and add the new movie to the list
      const newMovie = await fetchMovie(newMovieId, token);
      setWatchlistItem((prev) => ({
        ...prev,
        movie_ids: [...prev.movie_ids, newMovieId],
      }));
      setMovies((prev) => [...prev, newMovie]);
      setNewMovieId(""); // Reset movie ID input
      setError("");
    } catch (err) {
      console.error("Add movie error:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      setError(
        err.response?.data?.error ||
          err.message ||
          "Movie is already in this Watchlist"
      );
    }
  };

  // Display loading message while fetching
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
