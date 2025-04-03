// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchTopRankedMovies } from "../apis/ranking";
import { fetchUserRatings, updateRating, deleteRating } from "../apis/ratings";
import MovieCard from "../components/movieCard";

function Home({ authenticated, onAuthenticated }) {
  const [topMovies, setTopMovies] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [hasEverHadRatings, setHasEverHadRatings] = useState(false); 
  const [error, setError] = useState("");
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [newRatingValue, setNewRatingValue] = useState("");
  const [ratingToDelete, setRatingToDelete] = useState(null); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const deleteRatingModalRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !authenticated || !token) {
      setError("Please log in to see your movie recommendations and ratings");
      navigate("/");
      return;
    }

    const fetchRatings = async () => {
      console.log("Token used for ratings:", token);
      try {
        const data = await fetchUserRatings(userId, token);
        setUserRatings(data.rated_movies);
        if (data.rated_movies.length > 0) {
          setHasEverHadRatings(true); 
        }
      } catch (err) {
        setError(err.error || "Failed to fetch user ratings");
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again.");
        }
      }
    };

    fetchRatings();
  }, [userId, navigate, authenticated, token]);

  useEffect(() => {
    if (userRatings.length > 0 || hasEverHadRatings) {
      const fetchTopMovies = async () => {
        console.log("Token used for top movies:", token);
        try {
          const data = await fetchTopRankedMovies(userId, token);
          console.log("Top Movies Data:", data.top_ranked_movies);
          setTopMovies(data.top_ranked_movies);
        } catch (err) {
          setError(err.error || "Failed to fetch top movies");
          if (err.response?.status === 401) {
            setError("Unauthorized: Please log in again.");
          }
        }
      };

      fetchTopMovies();
    } else {
      setTopMovies([]); 
    }

    if (userRatings.length > 0) {
      setHasEverHadRatings(true);
    }
  }, [userRatings, userId, token, hasEverHadRatings]);

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
      console.log("Token used for updating rating:", token);
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
      setError(err.error || "Failed to update rating");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
    }
  };

  const handleDeleteRating = (ratingId) => {
    setRatingToDelete(ratingId);
    deleteRatingModalRef.current.showModal(); 
  };

  const confirmDeleteRating = async () => {
    if (!ratingToDelete) return;
    try {
      console.log("Token used for deleting rating:", token);
      await deleteRating(ratingToDelete, token);
      setUserRatings(
        userRatings.filter((rating) => rating.id !== ratingToDelete)
      );
      setRatingToDelete(null); 
      deleteRatingModalRef.current.close(); 
      setError("");
    } catch (err) {
      setError(err.error || "Failed to delete rating");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
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

    return (
      <div className="flex flex-wrap gap-8 justify-center">
        {movies.map((movie) => (
          <div
            key={movie.id || movie.title || Math.random()}
            className="w-1/4 flex-shrink-0 px-4"
          >
            <MovieCard movie={movie} to={`/movies/${movie.id}`} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Welcome, {role ? `${role} User` : "User"}!
      </h2>
      {error && <div className="alert alert-error mb-6">{error}</div>}
      {!hasEverHadRatings && userRatings.length === 0 ? (
        <div className="text-center">
          <h3 className="text-4xl font-bold text-gray-700 mb-4">
            Go to the movies section and explore to find movies!
          </h3>
          <Link to="/movies" className="text-xl underline text-blue-500">
            Browse Movies
          </Link>
        </div>
      ) : (
        <>
          <section className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Recommended Movies</h3>
            {renderRankedMovies(topMovies)}
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Your Top Ratings</h3>
            {userRatings.length === 0 ? (
              <div className="text-center text-gray-500">
                No ratings yet. Explore movies to add some!
                <Link to="/movies" className="underline text-blue-500 ml-2">
                  Browse Movies
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8 justify-center">
                {userRatings.map((rating) => (
                  <div key={rating.id} className="w-1/4 flex-shrink-0 px-4">
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
        </>
      )}
      <dialog
        id="delete_rating_modal"
        className="modal"
        ref={deleteRatingModalRef}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this rating?</p>
          <div className="modal-action">
            <button
              onClick={confirmDeleteRating}
              className="btn btn-error mr-2"
            >
              Yes, Delete
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Home;
