import React from "react";
import { Link } from "react-router-dom";

const WatchlistCard = ({ watchlist, onDelete }) => {
  const { id, title, movie_ids } = watchlist;
  const movieCount = Array.isArray(movie_ids) ? movie_ids.length : 0;

  return (
    <div className="card bg-gray-800 shadow-md hover:shadow-lg transition-shadow w-80 border border-gray-600 text-white">
      <div className="card-body p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-3">
          <h2 className="card-title text-xl font-semibold">
            <Link
              to={`/watchlist/${id}`}
              className="link link-hover text-primary"
            >
              {title}
            </Link>
          </h2>
          <p className="text-base text-gray-200">Movies: {movieCount}</p>
        </div>
        <div className="card-actions mt-8">
          <button onClick={() => onDelete(id)} className="btn btn-error btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistCard;
