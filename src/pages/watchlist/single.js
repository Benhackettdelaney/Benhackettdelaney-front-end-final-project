import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function WatchlistSingle() {
  const { watchlistId } = useParams();
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [movies, setMovies] = useState([]); // Store full movie data
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!watchlistId || !userId) {
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
            withCredentials: true,
          }
        );
        console.log("Watchlist item response:", response.data);
        setWatchlistItem(response.data);

        // Fetch full movie data for each movie_id
        const moviePromises = response.data.movie_ids.map((movieId) =>
          axios.get(`http://localhost:5000/movies/${movieId}`, {
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
  }, [watchlistId, userId, navigate]);

  if (!watchlistItem) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">{watchlistItem.title}</h2>
        <p>Movies in this watchlist:</p>
        {movies.length > 0 ? (
          <ul className="space-y-4">
            {movies.map((movie, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{movie.movie_title}</strong> ({movie.movie_genres})
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies in this watchlist yet.</p>
        )}

        <button
          onClick={() => navigate(`/watchlist/${watchlistId}/edit`)}
          className="bg-yellow-500 text-white p-2 rounded mr-2 mt-4"
        >
          Edit Watchlist
        </button>
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
