import React from "react";
import { Link } from "react-router-dom";

const PublicWatchlistCard = ({ watchlist }) => {
  const { id, title, username, is_public, movie_ids } = watchlist;
  const movieCount = Array.isArray(movie_ids) ? movie_ids.length : 0;

  return (
    <div className="card bg-gray-800 shadow-md hover:shadow-lg transition-shadow w-80 border border-gray-600 text-white">
      <div className="card-body p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-3">
          <h2 className="card-title text-xl font-semibold">
            <Link
              to={`/public-watchlists/${id}`}
              className="link link-hover text-primary"
            >
              {title}
            </Link>
          </h2>
          <p className="text-base text-gray-200">By: {username}</p>
          <p className="text-base text-gray-200">
            Status: {is_public ? "Public" : "Private"}
          </p>
          <p className="text-base text-gray-200">Movies: {movieCount}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicWatchlistCard;
