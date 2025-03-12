import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MovieSingle() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState("");
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/movies/${movieId}`,
          { withCredentials: true }
        );
        setMovie(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch movie");
      }
    };

    const fetchWatchlists = async () => {
      try {
        const response = await axios.get("http://localhost:5000/watchlists", {
          params: { user_id: userId },
          withCredentials: true,
        });
        console.log("Watchlists response:", response.data);
        setWatchlists(response.data);
        const myList = response.data.find((item) => item.title === "My List");
        if (myList) setSelectedWatchlistId(myList.id);
      } catch (err) {
        console.error("Fetch watchlists error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch watchlists");
      }
    };

    fetchMovie();
    if (userId) fetchWatchlists();

    if (!userId) {
      setError("Please log in to view this page");
      navigate("/");
    }
  }, [movieId, userId, navigate]);

  const handleAddToWatchlist = async () => {
    console.log("1. Starting handleAddToWatchlist", {
      userId,
      selectedWatchlistId,
      movieId,
    });
    if (!userId) {
      console.log("2. No userId, redirecting");
      setError("Please log in to add to watchlist");
      navigate("/");
      return;
    }
    if (!selectedWatchlistId) {
      console.log("2. No watchlist selected");
      setError("Please select a watchlist");
      return;
    }
    console.log("3. Preparing request");
    try {
      console.log("4. Before fetch");
      const url = `http://localhost:5000/watchlists/update/${selectedWatchlistId}`;
      const body = JSON.stringify({
        movie_id: movieId, // Dynamic movie ID from useParams
        user_id: userId, // Dynamic user ID from localStorage
      });
      console.log("5. Fetch URL and body:", { url, body });
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        credentials: "include",
      });
      console.log("6. Fetch response status:", response.status);
      const data = await response.json();
      console.log("7. Fetch response data:", data);
      if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`);
      }
      if (data.message === "Watchlist updated successfully") {
        console.log("8. Request successful, alerting");
        alert("Movie added to watchlist!");
        // Refetch watchlists to update UI
        const watchlistResponse = await axios.get(
          "http://localhost:5000/watchlists",
          {
            params: { user_id: userId },
            withCredentials: true,
          }
        );
        console.log("9. Refreshed watchlists:", watchlistResponse.data);
        setWatchlists(watchlistResponse.data);
      } else {
        console.log("8. Unexpected response:", data);
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Fetch error:", {
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || "Failed to add to watchlist");
    }
    console.log("10. handleAddToWatchlist completed");
  };

  const handleRate = async (rating) => {
    if (!userId) {
      setError("Please log in to rate movies");
      navigate("/");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/ratings",
        {
          user_id: userId,
          movie_id: movieId,
          rating,
        },
        { withCredentials: true }
      );
      alert("Rating submitted!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rate movie");
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      setError("Please log in to delete movies");
      navigate("/");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`http://localhost:5000/movies/delete/${movieId}`, {
        withCredentials: true,
      });
      alert("Movie deleted successfully!");
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete movie");
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-4 bg-white rounded shadow">
        <p>
          <strong>{movie.movie_title}</strong> ({movie.movie_genres})
        </p>
        <div className="mt-2">
          <select
            value={selectedWatchlistId}
            onChange={(e) => setSelectedWatchlistId(e.target.value)}
            className="p-1 border rounded mr-2"
          >
            <option value="">Select Watchlist</option>
            {watchlists.map((watchlist) => (
              <option key={watchlist.id} value={watchlist.id}>
                {watchlist.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToWatchlist}
            className="bg-blue-500 text-white p-1 rounded mr-2"
          >
            Add to Watchlist
          </button>
        </div>
        <select
          onChange={(e) => handleRate(parseFloat(e.target.value))}
          className="p-1 border rounded mr-2 mt-2"
        >
          <option value="">Rate</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          onClick={() => navigate(`/movies/${movieId}/edit`)}
          className="bg-yellow-500 text-white p-1 rounded mr-2 mt-2"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-1 rounded mt-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MovieSingle;
