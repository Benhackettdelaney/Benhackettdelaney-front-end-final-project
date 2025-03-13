
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Watchlist({ authenticated }) {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Get token from localStorage
  const navigate = useNavigate();

  const fetchWatchlist = useCallback(async () => {
    if (!token || !authenticated) {
      setError("Please log in to view your watchlist");
      navigate("/");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/watchlists", {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("Watchlist response:", response.data);
      setWatchlist(response.data);
    } catch (err) {
      const errorData = err.response?.data || "Unknown error";
      console.error("Watchlist fetch error:", JSON.stringify(errorData));
      setError(errorData.error || "Failed to fetch watchlist");
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid or missing authentication. Please log in again.");
        navigate("/");
      }
    }
  }, [navigate, userId, token, authenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleDeleteWatchlist = async (watchlistId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete watchlist ID ${watchlistId}?`
      )
    )
      return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/watchlists/delete/${watchlistId}`,
        {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log("Delete watchlist response:", response.data);
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
