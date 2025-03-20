import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopRankedMovies } from "../apis/ranking";
import { fetchUserRatings, updateRating, deleteRating } from "../apis/ratings";

function Home({ authenticated, onAuthenticated }) {
  const [topMovies, setTopMovies] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [error, setError] = useState("");
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [newRatingValue, setNewRatingValue] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !authenticated || !token) {
      setError("Please log in to see your movie recommendations and ratings");
      navigate("/");
      return;
    }

    console.log("Current userId:", userId);
    console.log("Token:", token);

    const fetchTopMovies = async () => {
      try {
        const data = await fetchTopRankedMovies(userId, token);
        console.log("Top movies response:", data);
        setTopMovies(data.top_ranked_movies);
      } catch (err) {
        console.error("Error fetching top movies:", err.response?.data);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          onAuthenticated(false);
          localStorage.clear();
          navigate("/");
        } else {
          setError(err.response?.data?.error || "Failed to fetch top movies");
        }
      }
    };

    const fetchRatings = async () => {
      try {
        const data = await fetchUserRatings(userId, token);
        console.log("User ratings response:", data);
        setUserRatings(data.rated_movies);
      } catch (err) {
        console.error("Error fetching user ratings:", err.response?.data);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          onAuthenticated(false);
          localStorage.clear();
          navigate("/");
        } else {
          setError(err.response?.data?.error || "Failed to fetch user ratings");
        }
      }
    };

    fetchTopMovies();
    fetchRatings();
  }, [userId, navigate, authenticated, token, onAuthenticated]);

  const handleEditRating = (rating) => {
    setEditingRatingId(rating.id);
    setNewRatingValue(rating.rating.toString());
  };

  const handleSaveRating = async (ratingId) => {
    try {
      const ratingValue = parseFloat(newRatingValue);
      if (isNaN(ratingValue) || ratingValue < 1.0 || ratingValue > 5.0) {
        setError("Rating must be a number between 1.0 and 5.0");
        return;
      }
      await updateRating(ratingId, ratingValue, token);
      const updatedRatings = userRatings.map((rating) =>
        rating.id === ratingId ? { ...rating, rating: ratingValue } : rating
      );
      setUserRatings(updatedRatings);
      setEditingRatingId(null);
      setNewRatingValue("");
      setError("");
    } catch (err) {
      console.error("Error updating rating:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        onAuthenticated(false);
        localStorage.clear();
        navigate("/");
      } else {
        setError(err.response?.data?.error || "Failed to update rating");
      }
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    try {
      const response = await deleteRating(ratingId, token);
      console.log("Delete rating response:", response);
      setUserRatings(userRatings.filter((rating) => rating.id !== ratingId));
      setError("");
    } catch (err) {
      console.error("Error deleting rating:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        onAuthenticated(false);
        localStorage.clear();
        navigate("/");
      } else {
        setError(err.response?.data?.error || "Failed to delete rating");
      }
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <section className="mb-10">
        <h2 className="text-2xl mb-4">
          Welcome, {role ? `${role} User` : "User"}!
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h3 className="text-xl mb-2">Recommended Movies</h3>
        {topMovies.length === 0 && !error ? (
          <p>Loading recommended movies...</p>
        ) : (
          <ul className="space-y-4">
            {topMovies.map((movie, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{movie.title}</strong> ({movie.genres})
                  <p>Predicted Rating: {movie.rating.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl mb-4">Top Ratings</h3>
        {userRatings.length === 0 ? (
          <p>You haven’t rated any movies yet.</p>
        ) : (
          <ul className="space-y-4">
            {userRatings.map((rating) => (
              <li
                key={rating.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{rating.title}</strong> ({rating.genres})
                  {editingRatingId === rating.id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newRatingValue}
                        onChange={(e) => setNewRatingValue(e.target.value)}
                        placeholder="New rating (1.0-5.0)"
                        className="p-1 border rounded mr-2"
                      />
                      <button
                        onClick={() => handleSaveRating(rating.id)}
                        className="bg-green-500 text-white p-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingRatingId(null);
                          setNewRatingValue("");
                        }}
                        className="bg-gray-500 text-white p-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>Your Rating: {rating.rating.toFixed(2)}</p>
                      <button
                        onClick={() => handleEditRating(rating)}
                        className="bg-yellow-500 text-white p-1 rounded mr-2 mt-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRating(rating.id)}
                        className="bg-red-500 text-white p-1 rounded mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
