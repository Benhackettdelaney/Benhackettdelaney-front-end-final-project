// src/pages/movies/single.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function MovieSingle({ authenticated }) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    if (!token || !authenticated) {
      setError("Please log in to view this page");
      navigate("/");
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/movies/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
          headers: { Authorization: `Bearer ${token}` },
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

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/movie/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Reviews response:", response.data);
        setReviews(response.data.reviews);
      } catch (err) {
        console.error("Fetch reviews error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch reviews");
      }
    };

    fetchMovie();
    if (userId && authenticated) {
      fetchWatchlists();
      fetchReviews();
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
    try {
      const response = await axios.put(
        `http://localhost:5000/watchlists/update/${selectedWatchlistId}`,
        { user_id: userId, movie_id: movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.message === "Watchlist updated successfully") {
        alert("Movie added to watchlist!");
        const watchlistResponse = await axios.get(
          "http://localhost:5000/watchlists",
          {
            params: { user_id: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWatchlists(watchlistResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to watchlist");
    }
  };

  const handleRate = async (rating) => {
    if (!userId || !authenticated) {
      setError("Please log in to rate movies");
      navigate("/");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/ratings",
        { user_id: userId, movie_id: movieId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rate movie");
    }
  };

  const handleDelete = async () => {
    if (!userId || !authenticated) {
      setError("Please log in to delete movies");
      navigate("/");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`http://localhost:5000/movies/delete/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Movie deleted successfully!");
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete movie");
    }
  };

  const handleAddReview = async () => {
    if (!userId || !authenticated) {
      setError("Please log in to add a review");
      navigate("/");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/reviews/create", // Fixed to /reviews/create
        { movie_id: movieId, content: reviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, response.data]);
      setReviewContent("");
      alert("Review added successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add review");
    }
  };

  const handleEditReview = async (reviewId) => {
    if (!userId || !authenticated) {
      setError("Please log in to edit reviews");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/reviews/update/${reviewId}`, // Updated to match your review.py
        { content: reviewContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, content: response.data.content } : r
        )
      );
      setEditingReviewId(null);
      setReviewContent("");
      alert("Review updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to edit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!userId || !authenticated) {
      setError("Please log in to delete reviews");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/reviews/delete/${reviewId}`, // Updated to match your review.py
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(reviews.filter((r) => r.id !== reviewId));
      alert("Review deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete review");
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
        {authenticated && (
          <>
            <button
              onClick={() => navigate(`/movies/${movieId}/edit`)}
              className="bg-yellow-500 text-white p-1 rounded mr-2 mt-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-1 rounded mr-2 mt-2"
            >
              Delete
            </button>
            <Link
              to="/watchlist"
              className="bg-blue-500 text-white p-1 rounded mt-2 inline-block"
            >
              Watchlist
            </Link>
          </>
        )}
      </div>

      {/* Review Section */}
      <div className="mt-6">
        <h3 className="text-xl mb-4">Reviews</h3>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write your review..."
          className="p-2 border rounded w-full mb-2"
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
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-100 rounded shadow flex flex-col"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{review.username}</p>
                  <p className="text-sm text-gray-500">
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
    </div>
  );
}

export default MovieSingle;
