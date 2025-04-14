import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Use image URL from navigation state or movie data
  const displayImageUrl =
    location.state?.imageUrl ||
    (movie?.image_url
      ? `http://127.0.0.1:5000${movie.image_url}`
      : "http://127.0.0.1:5000/static/movies/bloodborne1.jpg");

  // Use movie_title or title
  const title =
    movie && (movie.movie_title || movie.title)
      ? movie.movie_title || movie.title
      : "Untitled";

  return (
    <div className="container mx-auto p-6">
      <div
        className="hero min-h-[400px] shadow-xl mx-auto rounded-lg"
        style={{
          backgroundImage: `url(${displayImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h2 className="mb-2 text-4xl font-bold">{title}</h2>
            <p className="mb-2 text-sm">{movie?.movie_genres || "No genres"}</p>
            <p className="mb-4">{movie?.description || "No description available"}</p>
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto mt-4 flex justify-evenly gap-2">
        <select
          value={selectedWatchlistId}
          onChange={(e) => setSelectedWatchlistId(e.target.value)}
          className="select select-bordered max-w-xs text-base-content"
        >
          <option value="">Select Watchlist</option>
          {watchlists.map((watchlist) => (
            <option key={watchlist.id} value={watchlist.id}>
              {watchlist.title}
            </option>
          ))}
        </select>
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
          <div className="flex-1"></div>
        )}
      </div>
    </div>
  );
}

export default MovieSingleCard;