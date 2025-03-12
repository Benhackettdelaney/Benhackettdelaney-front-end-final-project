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
      setError("Please log in to add to watchlist");
      navigate("/");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/watchlists/create",
        formData,
        { withCredentials: true }
      );
      console.log("Watchlist create response:", response.data); 
      setFormData({ movie_id: "", title: "" });
      navigate("/watchlist");
    } catch (err) {
      console.error("Watchlist create error:", err.response?.data); 
      setError(err.response?.data?.error || "Failed to add to watchlist");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Add to Watchlist</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="movie_id"
          placeholder="Movie ID"
          value={formData.movie_id}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Add to Watchlist
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
