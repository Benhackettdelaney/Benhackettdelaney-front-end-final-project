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

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !token || !authenticated) {
      setError("Please log in to edit watchlists");
      navigate("/");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const requestData = { ...formData, user_id: userId };
      await updateWatchlist(watchlistId, requestData, token);
      setError("");
      navigate("/watchlist");
      window.alert("Watchlist updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update watchlist item");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl mb-4">Edit Watchlist</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {authenticated ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Watchlist Title"
            value={formData.title}
            onChange={handleChange}
            className="p-4 border rounded mr-2 w-full max-w-xs"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-4 rounded mt-4"
          >
            Update Watchlist
          </button>
        </form>
      ) : (
        <p className="text-red-500">Please log in to edit watchlists</p>
      )}
      <button
        onClick={() => navigate("/watchlist")}
        className="bg-gray-500 text-white p-4 rounded mt-4"
      >
        Back to Watchlist
      </button>
    </div>
  );
}

export default WatchlistEdit;
