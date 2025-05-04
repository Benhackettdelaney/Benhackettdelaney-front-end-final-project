import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchTopRankedMovies } from "../apis/ranking";
import { fetchUserRatings, updateRating, deleteRating } from "../apis/ratings";
import MovieCard from "../components/movieCard";

function Home({ authenticated, onAuthenticated }) {
  //States, modals, laoding and error handling
  const [topMovies, setTopMovies] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [hasEverHadRatings, setHasEverHadRatings] = useState(false);
  const [error, setError] = useState("");
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [newRatingValue, setNewRatingValue] = useState("");
  const [ratingToDelete, setRatingToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const deleteRatingModalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user ratings when component mounts
  useEffect(() => {
    if (!userId || !authenticated || !token) {
      setError("Please log in to see your movie recommendations and ratings");
      setIsLoading(false);
      navigate("/");
      return;
    }

    // Function to fetch user ratings
    const fetchRatings = async () => {
      try {
        const data = await fetchUserRatings(userId, token);
        console.log("User ratings response:", data.rated_movies);
        const validRatings = data.rated_movies
          .filter((rating) => rating.movie_id || rating.id) // Filter valid ratings
          .map((rating) => ({
            ...rating,
            movie_title: rating.movie_title || rating.title || "Untitled", // Set default title if missing
            image_url: rating.image_url || "/static/movies/bloodborne1.jpg", // Default image if missing
          }));
        setUserRatings(validRatings);
        if (validRatings.length > 0) {
          setHasEverHadRatings(true); // Set flag if user has ratings
        }
      } catch (err) {
        setError(err.error || "Failed to fetch user ratings");
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again.");
        }
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    // Fetch user ratings
    fetchRatings();
  }, [userId, authenticated, token, navigate]);

  // Fetch top-ranked movies based on user ratings
  useEffect(() => {
    if (userRatings.length > 0 || hasEverHadRatings) {
      const fetchTopMovies = async () => {
        try {
          const data = await fetchTopRankedMovies(userId, token);
          console.log("Top movies response:", data.top_ranked_movies);
          const normalizedMovies = data.top_ranked_movies.map((movie) => ({
            ...movie,
            movie_title: movie.title || movie.movie_title || "Untitled",
            image_url: movie.image_url || "/static/movies/bloodborne1.jpg",
          }));
          setTopMovies(normalizedMovies); // Set top movies
        } catch (err) {
          setError(err.error || "Failed to fetch top movies");
          if (err.response?.status === 401) {
            setError("Unauthorized: Please log in again.");
          }
        }
      };

      fetchTopMovies(); // Fetch top ranked movies
    } else {
      setTopMovies([]); // Set empty array if no ratings
    }

    if (userRatings.length > 0) {
      setHasEverHadRatings(true);
    }
  }, [userRatings, userId, token, hasEverHadRatings]);

  // Handle rating edit
  const handleEditRating = (rating) => {
    setEditingRatingId(rating.id);
    setNewRatingValue(rating.rating.toString());
  };

  // Save the updated rating
  const handleSaveRating = async (ratingId) => {
    try {
      const ratingValue = parseFloat(newRatingValue);
      if (isNaN(ratingValue) || ratingValue < 1.0 || ratingValue > 5.0) {
        setError("Rating must be a number between 1.0 and 5.0");
        return;
      }
      await updateRating(ratingId, ratingValue, token); // Update rating on backend
      setUserRatings(
        userRatings.map(
          (rating) =>
            rating.id === ratingId ? { ...rating, rating: ratingValue } : rating // Update rating value locally
        )
      );
      setEditingRatingId(null);
      setNewRatingValue("");
      setError("");
      window.alert("Rating updated successfully!");
    } catch (err) {
      setError(err.error || "Failed to update rating");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
    }
  };

  // Handle rating deletion
  const handleDeleteRating = (ratingId) => {
    setRatingToDelete(ratingId);
    deleteRatingModalRef.current.showModal();
  };

  // Confirm the rating deletion
  const confirmDeleteRating = async () => {
    if (!ratingToDelete) return;
    try {
      await deleteRating(ratingToDelete, token); // Delete rating from backend
      setUserRatings(
        userRatings.filter((rating) => rating.id !== ratingToDelete) // Remove deleted rating locally
      );
      setRatingToDelete(null);
      deleteRatingModalRef.current.close(); // Close modal
      setError("");
      window.alert("Rating deleted successfully!");
    } catch (err) {
      setError(err.error || "Failed to delete rating");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
    }
  };

  // Render ranked movies or a message if there are no top movies
  const renderRankedMovies = (movies) => {
    if (movies.length === 0 && !error) {
      return (
        <div className="text-center text-gray-500 py-6">
          No recommended movies available. Try rating some movies!
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-8 justify-center py-4">
        {movies.map((movie) => (
          <div
            key={movie.id || movie.movie_title || Math.random()}
            className="w-1/4 flex-shrink-0 px-4"
          >
            <MovieCard movie={movie} to={`/movies/${movie.id}`} />
          </div>
        ))}
      </div>
    );
  };

  // Show a loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen py-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-primary mb-8">
        Welcome{role === "admin" ? " Admin" : ""}!
      </h2>
      {error && <div className="alert alert-error mb-8">{error}</div>}
      {!hasEverHadRatings && userRatings.length === 0 ? (
        <div className="text-center py-6">
          <h3 className="text-4xl font-bold text-gray-700 mb-4">
            Go to the movies section and explore to find movies!
          </h3>
          <Link to="/movies" className="text-xl underline text-blue-500">
            Browse Movies
          </Link>
        </div>
      ) : (
        <>
          <section className="mb-16">
            <h3 className="text-2xl font-semibold mb-6">Recommended Movies</h3>
            {renderRankedMovies(topMovies)}
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-6">Your Top Ratings</h3>
            {userRatings.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No ratings yet. Explore movies to add some!
                <Link to="/movies" className="underline text-blue-500 ml-2">
                  Browse Movies
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8 justify-center py-4">
                {userRatings.map((rating) => (
                  <div key={rating.id} className="w-1/4 flex-shrink-0 px-4">
                    <MovieCard
                      movie={rating}
                      to={`/movies/${
                        rating.movie_id ||
                        (typeof rating.id === "string" &&
                        rating.id !== "Unknown"
                          ? rating.id
                          : "#")
                      }`}
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
        <div className="modal-box p-6">
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
