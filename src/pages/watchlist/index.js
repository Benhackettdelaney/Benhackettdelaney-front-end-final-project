// src/pages/watchlist/index.jsx (or Watchlist.jsx)
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWatchlists, deleteWatchlist } from "../../apis/watchlist";

function Watchlist({ authenticated }) {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchWatchlistData = useCallback(async () => {
    if (!token || !authenticated) {
      setError("Please log in to view your watchlist");
      navigate("/"); // Redirect to login, not home
      return;
    }
    try {
      const watchlistData = await fetchWatchlists(userId, token);
      setWatchlist(watchlistData);
    } catch (err) {
      console.error("Watchlist fetch error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to fetch watchlist");
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid or missing authentication. Please log in again.");
        navigate("/"); // Redirect to login
      }
    }
  }, [navigate, userId, token, authenticated]);

  useEffect(() => {
    fetchWatchlistData();
  }, [fetchWatchlistData]);

  const handleDeleteWatchlist = async (watchlistId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete watchlist ID ${watchlistId}?`
      )
    )
      return;

    try {
      await deleteWatchlist(watchlistId, userId, token);
      setWatchlist((prev) => prev.filter((item) => item.id !== watchlistId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete watchlist");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">My Watchlists</h2>
      {error && <p className="text-red-500">{error}</p>}
      {authenticated && (
        <div className="mb-4">
          <Link
            to="/watchlist/create"
            className="bg-green-500 text-white p-2 rounded inline-block"
          >
            Create Watchlist
          </Link>
        </div>
      )}
      <ul className="space-y-4">
        {watchlist.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <Link
              to={`/watchlist/${item.id}`}
              className="text-blue-500 hover:underline"
            >
              {item.title}
            </Link>
            <button
              onClick={() => handleDeleteWatchlist(item.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlist;
