import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWatchlist, updateWatchlist } from "../../apis/watchlist";

function WatchlistEdit({ authenticated }) {
  const { watchlistId } = useParams();
  const [formData, setFormData] = useState({ title: "" });
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!watchlistId || !userId || !token || !authenticated) {
      setError("Please log in or provide a valid watchlist ID");
      navigate("/");
      return;
    }

    const loadWatchlist = async () => {
      try {
        const watchlistData = await fetchWatchlist(watchlistId, userId, token);
        setFormData({ title: watchlistData.title });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch watchlist item");
      }
    };

    loadWatchlist();
  }, [watchlistId, userId, navigate, token, authenticated]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = { ...formData, user_id: userId };
      await updateWatchlist(watchlistId, requestData, token);
      navigate("/watchlist");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update watchlist item");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Edit Watchlist Item</h2>
      {error && <p className="text-red-500">{error}</p>}
      {authenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="title"
            placeholder="Watchlist Title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Update Watchlist Item
          </button>
        </form>
      ) : (
        <p className="text-red-500">Please log in to edit watchlists</p>
      )}
      <button
        onClick={() => navigate("/watchlist")}
        className="bg-gray-500 text-white p-2 rounded"
      >
        Back to Watchlist
      </button>
    </div>
  );
}

export default WatchlistEdit;
