// src/components/MovieSingleCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

function MovieSingleCard({
  movie,
  watchlists,
  selectedWatchlistId,
  setSelectedWatchlistId,
  handleAddToWatchlist,
  handleRate,
  handleDelete,
  userId,
  authenticated,
  role,
  movieId,
}) {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  if (!process.env.REACT_APP_API_URL) {
    console.warn(
      "REACT_APP_API_URL is undefined, using fallback: http://localhost:5000"
    );
  }

  // Log image_url for debugging
  console.log("MovieSingleCard image_url:", movie?.image_url);

  // Construct image URL
  const imageUrl = movie?.image_url
    ? `${apiUrl}/static/${
        movie.image_url.startsWith("movies/")
          ? movie.image_url
          : `movies/${movie.image_url}`
      }`
    : `${apiUrl}/static/movies/bloodborne1.jpg`; // Default to bloodborne1.jpg
  const fallbackImage =
    "https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp";

  // Log constructed URL
  console.log("MovieSingleCard constructed image URL:", imageUrl);

  return (
    <div
      className="hero min-h-[400px] shadow-xl mx-auto"
      style={{
        backgroundImage: `url(${imageUrl}), url(${fallbackImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md flex flex-col h-full justify-between">
          {/* Top Content */}
          <div>
            <h2 className="mb-2 text-4xl font-bold">
              {movie?.movie_title || "Untitled"}
            </h2>
            <p className="mb-2 text-sm">{movie?.movie_genres || "No genres"}</p>
            <p className="mb-4">
              {movie?.description || "No description available"}
            </p>
            {/* Watchlist Dropdown */}
            <div className="mb-4">
              <select
                value={selectedWatchlistId}
                onChange={(e) => setSelectedWatchlistId(e.target.value)}
                className="select select-bordered w-full max-w-xs text-base-content"
              >
                <option value="">Select Watchlist</option>
                {watchlists.map((watchlist) => (
                  <option key={watchlist.id} value={watchlist.id}>
                    {watchlist.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Bottom Buttons */}
          <div className="flex w-full justify-evenly mt-auto gap-2">
            <button
              onClick={handleAddToWatchlist}
              className="btn btn-primary flex-1"
            >
              Add to Watchlist
            </button>
            <select
              onChange={(e) => handleRate(parseFloat(e.target.value))}
              className="select select-bordered btn btn-outline btn-primary flex-1 text-base-content"
              defaultValue=""
            >
              <option value="" disabled>
                Rate
              </option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {authenticated && role === "admin" && (
              <>
                <button
                  onClick={() => navigate(`/movies/${movieId}/edit`)}
                  className="btn btn-warning flex-1"
                >
                  Edit
                </button>
                <button onClick={handleDelete} className="btn btn-error flex-1">
                  Delete
                </button>
              </>
            )}
            {!(authenticated && role === "admin") && (
              <>
                <div className="flex-1"></div>
                <div className="flex-1"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieSingleCard;
