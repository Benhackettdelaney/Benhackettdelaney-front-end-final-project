import React from "react";
import { Link } from "react-router-dom";

const PublicWatchlistCard = ({ watchlist }) => {
  const { id, title, username, is_public, movie_ids } = watchlist;
  const movieCount = Array.isArray(movie_ids) ? movie_ids.length : 0;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow w-72">
      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">
          <Link
            to={`/public-watchlists/${id}`}
            className="link link-hover text-primary"
          >
            {title}
          </Link>
        </h2>
        <p className="text-sm text-gray-600">By: {username}</p>
        <p className="text-sm text-gray-600">
          Status: {is_public ? "Public" : "Private"}
        </p>
        <p className="text-sm text-gray-600">Movies: {movieCount}</p>
      </div>
    </div>
  );
};

export default PublicWatchlistCard;
