import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWatchlist } from "../../apis/watchlist";

function WatchlistCreate({ authenticated }) {
  const [formData, setFormData] = useState({ movie_id: "", title: "" });
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      console.log("Auth failure: ", { userId, token, authenticated });
      setError("Please log in to create a watchlist");
      navigate("/");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      console.log("Submitting watchlist:", { formData, userId, token });
      const requestData = { ...formData, user_id: userId };
      await createWatchlist(requestData, token);
      setFormData({ movie_id: "", title: "" });
      setError("");
      navigate("/watchlist");
      window.alert("Watchlist created successfully!");
    } catch (err) {
      console.error(
        "Watchlist create error:",
        err.response?.data || err.message
      );
      if (err.response?.status === 409) {
        setError("Watchlist title has already been chosen");
      } else {
        setError(err.response?.data?.error || "Failed to create watchlist");
      }
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
        navigate("/");
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl mb-4">Create Watchlist</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {authenticated ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            name="movie_id"
            placeholder="Movie ID (optional)"
            value={formData.movie_id}
            onChange={handleChange}
            className="p-4 border rounded mr-2 w-full max-w-xs"
          />
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
            Create Watchlist
          </button>
        </form>
      ) : (
        <p className="text-red-500">Please log in to create watchlists</p>
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

export default WatchlistCreate;
