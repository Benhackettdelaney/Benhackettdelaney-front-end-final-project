import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPublicWatchlists } from "../../apis/watchlist";
import { fetchMovie } from "../../apis/movie";

function PublicWatchlistSingle({ authenticated }) {
  // Get watchlist ID from the URL parameters
  const { id: watchlistId } = useParams();
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Get the authentication token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Function to load the public watchlist based on the watchlist ID
    const loadPublicWatchlist = async () => {
      try {
        const publicLists = await fetchPublicWatchlists(); // Fetch all public watchlists
        const item = publicLists.find((wl) => wl.id.toString() === watchlistId); // Find the specific watchlist by ID
        if (item) {
          if (item.movie_ids && item.movie_ids.length > 0) {
            // If there are movie IDs in the watchlist, fetch the movie details
            const moviePromises = item.movie_ids.map(
              (movieId) => fetchMovie(movieId, token) // Fetch each movie using the movie ID
            );

            // Wait for all movie data to load
            const movies = await Promise.all(moviePromises);
            // Map movie data to the required format
            item.movies = movies.map((movie) => ({
              id: movie.id,
              title: movie.movie_title,
              genres: movie.movie_genres,
            }));
          } else {
            item.movies = []; // If no movies are in the watchlist, set it as an empty array
          }
          setWatchlistItem(item);
        } else {
          setError("Watchlist not found");
        }
      } catch (err) {
        setError(err.error || "Failed to fetch public watchlist");
      } finally {
        setLoading(false);
      }
    };

    // Call the function to load the watchlist
    loadPublicWatchlist();
  }, [watchlistId, token]);

  // Show loading message while data is being fetched
  if (loading)
    return <div className="container mx-auto mt-10 p-10">Loading...</div>;

  // Show error message if there was an error fetching the watchlist
  if (error)
    return (
      <div className="container mx-auto mt-10 p-10 text-red-500">{error}</div>
    );

  // Show message if no watchlist item is found
  if (!watchlistItem)
    return (
      <div className="container mx-auto mt-10 p-10">Watchlist not found</div>
    );

  return (
    <div className="container mx-auto p-10">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {watchlistItem.title}
      </h2>
      <p className="text-gray-600">By: {watchlistItem.username}</p>
      <p className="text-gray-600">
        Visibility: {watchlistItem.is_public ? "Public" : "Private"}
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Movies in this Watchlist</h3>
        {watchlistItem.movies && watchlistItem.movies.length > 0 ? (
          <ul className="space-y-6">
            {watchlistItem.movies.map((movie) => (
              <li
                key={movie.id}
                className="p-6 bg-gray-700 rounded shadow flex justify-between items-center text-white"
              >
                <div>
                  <strong>{movie.title}</strong> ({movie.genres})
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No movies in this watchlist yet.</p>
        )}
      </div>

      <Link to="/public-watchlists" className="btn btn-neutral mt-8">
        Back to Public Watchlists
      </Link>
    </div>
  );
}

export default PublicWatchlistSingle;
