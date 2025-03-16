// src/pages/home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home({ authenticated, onAuthenticated }) {
  const [topMovies, setTopMovies] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [error, setError] = useState("");
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

    const fetchTopMovies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ranking", {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Top movies response:", response.data);
        setTopMovies(response.data.top_ranked_movies);
      } catch (err) {
        console.error("Error fetching top movies:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch top movies");
      }
    };

    const fetchUserRatings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ratings", {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User ratings response:", response.data);
        setUserRatings(response.data.rated_movies);
      } catch (err) {
        console.error("Error fetching user ratings:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch user ratings");
      }
    };

    fetchTopMovies();
    fetchUserRatings();
  }, [userId, navigate, authenticated, token]);

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
            {userRatings.map((rating, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <strong>{rating.title}</strong> ({rating.genres})
                  <p>Your Rating: {rating.rating.toFixed(2)}</p>
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
