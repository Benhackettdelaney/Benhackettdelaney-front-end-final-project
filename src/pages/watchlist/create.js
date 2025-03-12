import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WatchlistCreate() {
  const [formData, setFormData] = useState({ movie_id: "", title: "" });
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Please log in to create a watchlist");
      navigate("/");
      return;
    }
    try {
      // Include user_id in the request body
      const requestData = {
        ...formData,
        user_id: userId,
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/watchlists/create",
        requestData,
        { withCredentials: true }
      );
      console.log("Watchlist create response:", response.data);
      setFormData({ movie_id: "", title: "" });
      navigate("/watchlist");
    } catch (err) {
      console.error("Watchlist create error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create watchlist");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Create Watchlist</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="movie_id"
          placeholder="Movie ID (optional)"
          value={formData.movie_id}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          name="title"
          placeholder="Watchlist Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Create Watchlist
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

export default WatchlistCreate;
