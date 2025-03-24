import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchTopRankedMovies } from "../apis/ranking";
import { fetchUserRatings, updateRating, deleteRating } from "../apis/ratings";
import MovieCard from "../components/movieCard";

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

    const fetchTopMovies = async () => {
      try {
        const data = await fetchTopRankedMovies(userId, token);
        console.log("Top Movies Data:", data.top_ranked_movies);
        setTopMovies(data.top_ranked_movies);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch top movies");
      }
    };

    const fetchRatings = async () => {
      try {
        const data = await fetchUserRatings(userId, token);
        setUserRatings(data.rated_movies);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch user ratings");
      }
    };

    fetchTopMovies();
    fetchRatings();
  }, [userId, navigate, authenticated, token]);

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
      setUserRatings(
        userRatings.map((rating) =>
          rating.id === ratingId ? { ...rating, rating: ratingValue } : rating
        )
      );
      setEditingRatingId(null);
      setNewRatingValue("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update rating");
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    try {
      await deleteRating(ratingId, token);
      setUserRatings(userRatings.filter((rating) => rating.id !== ratingId));
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete rating");
    }
  };

  const renderRankedMovies = (movies) => {
    if (movies.length === 0 && !error) {
      return (
        <div className="text-center text-gray-500">
          Loading recommended movies...
        </div>
      );
    }

    const topRow = movies.slice(0, 4); // First 4 movies
    const bottomMovie = movies.length > 4 ? movies[4] : null; // 5th movie

    return (
      <div className="flex flex-col items-center gap-6">
        {/* Top Row: 4 Cards */}
        <div className="flex flex-wrap gap-6 justify-center w-full">
          {topRow.map((movie) => (
            <div
              key={movie.id || movie.title || Math.random()}
              className="w-1/4 flex-shrink-0 px-2"
            >
              <MovieCard movie={movie} to={`/movies/${movie.id}`} />
            </div>
          ))}
        </div>
        {/* Bottom Row: 1 Card Centered */}
        {bottomMovie && (
          <div className="flex justify-center w-full">
            <div className="w-1/4 flex-shrink-0 px-2">
              <MovieCard movie={bottomMovie} to={`/movies/${bottomMovie.id}`} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6">
          Welcome, {role ? `${role} User` : "User"}!
        </h2>
        {error && <div className="alert alert-error mb-6">{error}</div>}
        <h3 className="text-2xl font-semibold mb-4">Recommended Movies</h3>
        {renderRankedMovies(topMovies)}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Your Top Ratings</h3>
        {userRatings.length === 0 ? (
          <div className="text-center text-gray-500">
            Go off and explore our movie selection!{" "}
            <Link to="/movies" className="underline text-blue-500">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {userRatings.map((rating) => (
              <div key={rating.id} className="w-1/5 flex-shrink-0 px-2">
                <MovieCard
                  movie={rating}
                  to={`/movies/${rating.movie_id || rating.id}`}
                  showActions={true}
                  onEdit={() => handleEditRating(rating)}
                  onDelete={() => handleDeleteRating(rating.id)}
                  isEditing={editingRatingId === rating.id}
                  newRatingValue={newRatingValue}
                  onRatingChange={(e) => setNewRatingValue(e.target.value)}
                  onSave={() => handleSaveRating(rating.id)}
                  onCancel={() => {
                    setEditingRatingId(null);
                    setNewRatingValue("");
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
