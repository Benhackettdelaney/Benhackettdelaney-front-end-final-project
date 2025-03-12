import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/watchlists", {
        params: { user_id: userId },
        withCredentials: true,
      });
      console.log("Watchlist response:", response.data);
      setWatchlist(response.data);
    } catch (err) {
      const errorData = err.response?.data || "Unknown error";
      console.error("Watchlist fetch error:", JSON.stringify(errorData));
      setError(errorData.error || "Failed to fetch watchlist");
      if (err.response?.status === 400) {
        setError("Invalid or missing user_id. Please log in again.");
        navigate("/");
      }
    }
  }, [navigate, userId]);

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your watchlist");
      navigate("/");
      return;
    }
    fetchWatchlist();
  }, [userId, navigate, fetchWatchlist]);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">My Watchlists</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {watchlist.map((item) => (
          <li key={item.id} className="p-4 bg-white rounded shadow">
            <Link
              to={`/watchlist/${item.id}`}
              className="text-blue-500 hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlist;
