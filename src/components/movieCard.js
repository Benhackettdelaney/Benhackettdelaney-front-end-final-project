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
  const defaultImage =
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

  return (
    <div className="card bg-base-100 w-96 shadow-sm hover:shadow-lg transition-shadow relative">
      {/* Image and Details */}
      <figure>
        <Link to={to || `/movies/${movie.id}`}>
          <img
            src={movie.imageUrl || defaultImage}
            alt={movie.title}
            className="object-cover w-full h-64"
          />
        </Link>
      </figure>
      <div className="card-body py-6">
        <Link to={to || `/movies/${movie.id}`} className="block">
          <h2 className="card-title text-black hover:text-primary">
            {movie.title}
          </h2>
        </Link>
        <p className="text-gray-600">{movie.genres}</p>
        {movie.rating && (
          <p className="text-sm text-yellow-600">
            Rating: {movie.rating.toFixed(2)}
          </p>
        )}
        {/* Display Ratings and Reviews Counts */}
        {(movie.ratingsCount !== undefined ||
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

        {/* Action Buttons (Outside Link) */}
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
