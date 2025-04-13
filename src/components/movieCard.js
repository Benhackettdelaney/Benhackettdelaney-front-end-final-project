// MovieCard.js
import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({
  movie,
  to,
  showActions = false,
  onEdit,
  onDelete,
  isEditing,
  newRatingValue,
  onRatingChange,
  onSave,
  onCancel,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // if (!process.env.REACT_APP_API_URL) {
  //   console.warn(
  //     "REACT_APP_API_URL is undefined, using fallback: http://localhost:5000"
  //   );
  // }

  const defaultImage = `${apiUrl}/static/movies/bloodborne1.jpg`;

  // Debug movie data
  console.log("MovieCard data:", movie);

  // Ensure image URL is valid
  const imageUrl =
    movie && movie.image_url ? `${apiUrl}${movie.image_url}` : defaultImage;

  // Use movie_title or title, movie_genres or genres
  const title =
    movie && (movie.movie_title || movie.title)
      ? movie.movie_title || movie.title
      : "Untitled";
  const genres =
    movie && (movie.movie_genres || movie.genres)
      ? movie.movie_genres || movie.genres
      : "No genres";

  return (
    <div className="card bg-base-100 w-96 shadow-sm hover:shadow-lg transition-shadow relative">
      <figure className="relative w-full h-64 overflow-hidden">
        <Link to={to || (movie && movie.id ? `/movies/${movie.id}` : "#")}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain bg-gray-100"
            onError={(e) => {
              console.warn(`Failed to load image: ${imageUrl}`);
              e.target.src = defaultImage;
            }}
          />
        </Link>
      </figure>
      <div className="card-body py-6">
        <Link
          to={to || (movie && movie.id ? `/movies/${movie.id}` : "#")}
          className="block"
        >
          <h2 className="card-title text-black hover:text-primary">{title}</h2>
        </Link>
        <p className="text-gray-600">{genres}</p>
        {movie && movie.rating && (
          <p className="text-sm text-yellow-600">
            Rating: {movie.rating.toFixed(2)}
          </p>
        )}
        {movie &&
          (movie.ratingsCount !== undefined ||
            movie.reviewsCount !== undefined) && (
            <p className="text-sm text-gray-500">
              {movie.ratingsCount !== undefined
                ? `${movie.ratingsCount} ratings`
                : "0 ratings"}
              {movie.reviewsCount !== undefined
                ? `, ${movie.reviewsCount} reviews`
                : ", 0 reviews"}
            </p>
          )}

        {showActions && (
          <div className="mt-4 flex justify-end gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newRatingValue}
                  onChange={onRatingChange}
                  placeholder="1.0-5.0"
                  className="input input-bordered w-20"
                />
                <button onClick={onSave} className="btn btn-success btn-sm">
                  Save
                </button>
                <button onClick={onCancel} className="btn btn-neutral btn-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button onClick={onEdit} className="btn btn-warning btn-sm">
                  Edit
                </button>
                <button onClick={onDelete} className="btn btn-error btn-sm">
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
