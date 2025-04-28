import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createRating } from "../../apis/ratings";
import { updateWatchlist } from "../../apis/watchlist";
import { fetchMovie, deleteMovie } from "../../apis/movie";
import { fetchWatchlists } from "../../apis/watchlist";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../apis/reviews";
import { removeActorFromMovie } from "../../apis/actor";
import MovieSingleCard from "../../components/movieSingleCard";

function MovieSingle({ authenticated }) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [actorToRemove, setActorToRemove] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [error, setError] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const deleteMovieModalRef = useRef(null);
  const deleteReviewModalRef = useRef(null);
  const deleteActorModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    if (!token || !authenticated) {
      setError("Please log in to view this page");
      navigate("/");
      return;
    }

    const fetchMovieData = async () => {
      console.log("Token used for fetching movie:", token);
      try {
        const response = await fetchMovie(movieId, token);
        console.log("Fetched movie:", response);
        setMovie(response);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch movie");
        if (err.response?.status === 401)
          setError("Unauthorized: Please log in again.");
      }
    };

    const fetchWatchlistsData = async () => {
      console.log("Token used for fetching watchlists:", token);
      try {
        const response = await fetchWatchlists(userId, token);
        setWatchlists(response);
        const myList = response.find((item) => item.title === "My List");
        if (myList) setSelectedWatchlistId(myList.id);
      } catch (err) {
        console.error("Fetch watchlists error:", err);
        setError(err.response?.data?.error || "Failed to fetch watchlists");
        if (err.response?.status === 401)
          setError("Unauthorized: Please log in again.");
      }
    };

    const fetchReviewsData = async () => {
      console.log("Token used for fetching reviews:", token);
      try {
        const response = await fetchReviews(movieId, token);
        setReviews(response);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setError(err.response?.data?.error || "Failed to fetch reviews");
        if (err.response?.status === 401)
          setError("Unauthorized: Please log in again.");
      }
    };

    fetchMovieData();
    if (userId && authenticated) {
      fetchWatchlistsData();
      fetchReviewsData();
    }
  }, [movieId, userId, navigate, authenticated, token]);

  const handleAddToWatchlist = async () => {
    if (!userId || !authenticated) {
      setError("Please log in to add to watchlist");
      navigate("/");
      return;
    }
    if (!selectedWatchlistId) {
      setError("Please select a watchlist");
      return;
    }
    console.log("Token used for adding to watchlist:", token);
    try {
      await updateWatchlist(
        selectedWatchlistId,
        { user_id: userId, movie_id: movieId },
        token
      );
      const watchlistResponse = await fetchWatchlists(userId, token);
      setWatchlists(watchlistResponse);
      window.alert("Movie added to watchlist successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to watchlist");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleRate = async (rating) => {
    if (!userId || !authenticated) {
      setError("Please log in to rate movies");
      navigate("/");
      return;
    }
    console.log("Token used for rating:", token);
    try {
      await createRating(userId, movieId, rating, token);
      window.alert("Movie rated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rate movie");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleDelete = () => {
    if (!userId || !authenticated) {
      setError("Please log in to delete movies");
      navigate("/");
      return;
    }
    deleteMovieModalRef.current.showModal();
  };

  const confirmDeleteMovie = async () => {
    console.log("Token used for deleting movie:", token);
    try {
      await deleteMovie(movieId, token);
      deleteMovieModalRef.current.close();
      window.alert("Movie deleted successfully!");
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete movie");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleAddReview = async () => {
    if (!userId || !authenticated) {
      setError("Please log in to add a review");
      navigate("/");
      return;
    }
    console.log("Token used for adding review:", token);
    try {
      const response = await createReview(movieId, reviewContent, token);
      setReviews([...reviews, response]);
      setReviewContent("");
      window.alert("Review added successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add review");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleEditReview = async (reviewId) => {
    if (!userId || !authenticated) {
      setError("Please log in to edit reviews");
      return;
    }
    console.log("Token used for editing review:", token);
    try {
      const response = await updateReview(reviewId, reviewContent, token);
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, content: response.content } : r
        )
      );
      setEditingReviewId(null);
      setReviewContent("");
      window.alert("Review updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to edit review");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (!userId || !authenticated) {
      setError("Please log in to delete reviews");
      return;
    }
    setReviewToDelete(reviewId);
    deleteReviewModalRef.current.showModal();
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    console.log("Token used for deleting review:", token);
    try {
      await deleteReview(reviewToDelete, token);
      setReviews(reviews.filter((r) => r.id !== reviewToDelete));
      setReviewToDelete(null);
      deleteReviewModalRef.current.close();
      window.alert("Review deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete review");
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const handleRemoveActor = (actorId) => {
    if (!userId || !authenticated || role !== "admin") {
      setError("Only admins can remove actors from movies");
      return;
    }
    setActorToRemove(actorId);
    deleteActorModalRef.current.showModal();
  };

  const confirmRemoveActor = async () => {
    if (!actorToRemove) return;
    console.log("Token used for removing actor:", token);
    try {
      await removeActorFromMovie(movieId, actorToRemove, token);
      setMovie({
        ...movie,
        actors: movie.actors.filter((actor) => actor.id !== actorToRemove),
      });
      setActorToRemove(null);
      deleteActorModalRef.current.close();
      window.alert("Actor removed successfully!");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to remove actor from movie"
      );
      if (err.response?.status === 401)
        setError("Unauthorized: Please log in again.");
    }
  };

  const renderActors = () => (
    <div className="mt-8 p-6">
      <h3 className="text-xl mb-4">Actors</h3>
      {movie && movie.actors && movie.actors.length > 0 ? (
        <ul className="list-disc pl-5">
          {movie.actors.map((actor) => (
            <li
              key={actor.id}
              className="flex justify-between items-center mb-4 p-2"
            >
              <Link
                to={`/actors/${actor.id}`}
                className="text-blue-500 underline text-lg"
              >
                {actor.name || "Unknown Actor"}
              </Link>
              {role === "admin" && (
                <button
                  onClick={() => handleRemoveActor(actor.id)}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No actors assigned yet.</p>
      )}
    </div>
  );

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-12 px-12">
      {error && <div className="alert alert-error mb-10">{error}</div>}
      <MovieSingleCard
        movie={movie}
        watchlists={watchlists}
        selectedWatchlistId={selectedWatchlistId}
        setSelectedWatchlistId={setSelectedWatchlistId}
        handleAddToWatchlist={handleAddToWatchlist}
        handleRate={handleRate}
        handleDelete={handleDelete}
        userId={userId}
        authenticated={authenticated}
        role={role}
        movieId={movieId}
      />

      {renderActors()}

      <div className="mt-8 p-4">
        <h3 className="text-xl mb-4">Reviews</h3>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write your review..."
          className="p-2 border rounded w-full mb-4"
          rows="3"
        />
        <button
          onClick={
            editingReviewId
              ? () => handleEditReview(editingReviewId)
              : handleAddReview
          }
          className="bg-green-500 text-white p-2 rounded"
        >
          {editingReviewId ? "Update Review" : "Add Review"}
        </button>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="mt-4 space-y-4 p-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-800 rounded shadow flex flex-col text-white"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{review.username}</p>
                  <p className="text-sm text-gray-300">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-2">{review.content}</p>
                {review.user_id === parseInt(userId) && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setReviewContent(review.content);
                      }}
                      className="bg-yellow-500 text-white p-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog
        id="delete_movie_modal"
        className="modal"
        ref={deleteMovieModalRef}
      >
        <div className="modal-box p-6">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this movie?</p>
          <div className="modal-action">
            <button onClick={confirmDeleteMovie} className="btn btn-error mr-2">
              Yes, Delete
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="delete_review_modal"
        className="modal"
        ref={deleteReviewModalRef}
      >
        <div className="modal-box p-6">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this review?</p>
          <div className="modal-action">
            <button
              onClick={confirmDeleteReview}
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

      <dialog
        id="delete_actor_modal"
        className="modal"
        ref={deleteActorModalRef}
      >
        <div className="modal-box p-6">
          <h3 className="text-lg font-bold">Confirm Removal</h3>
          <p className="py-4">
            Are you sure you want to remove this actor from the movie?
          </p>
          <div className="modal-action">
            <button onClick={confirmRemoveActor} className="btn btn-error mr-2">
              Yes, Remove
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

export default MovieSingle;
