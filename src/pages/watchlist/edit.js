import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function WatchlistEdit() {
  const { watchlistId } = useParams();
  const [formData, setFormData] = useState({ title: "" });
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!watchlistId || !userId) {
      setError("Please log in or provide a valid watchlist ID");
      navigate("/");
      return;
    }

    const fetchWatchlistItem = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/watchlists", {
          withCredentials: true,
        });
        const item = response.data.find(
          (entry) => entry.id === parseInt(watchlistId)
        );
        if (!item) throw new Error("Watchlist item not found");
        setFormData({ title: item.title });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch watchlist item");
      }
    };

    fetchWatchlistItem();
  }, [watchlistId, userId, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:5000/watchlists/update/${watchlistId}`,
        formData,
        { withCredentials: true }
      );
      navigate("/watchlist");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update watchlist item");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Edit Watchlist Item</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Update Watchlist Item
        </button>
      </form>
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
