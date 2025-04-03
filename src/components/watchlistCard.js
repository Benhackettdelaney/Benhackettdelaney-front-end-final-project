import React from "react";
import { Link } from "react-router-dom";

const WatchlistCard = ({ watchlist, onDelete }) => {
  const { id, title, movie_ids } = watchlist;
  const movieCount = Array.isArray(movie_ids) ? movie_ids.length : 0;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow w-72">
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title text-lg font-semibold">
            <Link
              to={`/watchlist/${id}`}
              className="link link-hover text-primary"
            >
              {title}
            </Link>
          </h2>
          <p className="text-sm text-gray-600">Movies: {movieCount}</p>
        </div>
        <div className="card-actions justify-end mt-2">
          <button onClick={() => onDelete(id)} className="btn btn-error btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistCard;
