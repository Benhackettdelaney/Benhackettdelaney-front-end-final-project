import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWatchlists, deleteWatchlist } from "../../apis/watchlist";
import UserWatchlistCard from "../../components/watchlistCard";

function Watchlist({ authenticated }) {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState("");
  const [watchlistToDelete, setWatchlistToDelete] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const deleteWatchlistModalRef = useRef(null);
  const navigate = useNavigate();

  const fetchWatchlistData = useCallback(async () => {
    if (!token || !authenticated) {
      setError("Please log in to view your watchlist");
      navigate("/");
      return;
    }
    console.log("Token used for fetching watchlists:", token);
    try {
      const watchlistData = await fetchWatchlists(userId, token);
      setWatchlist(watchlistData);
    } catch (err) {
      console.error("Watchlist fetch error:", err);
      setError(err.error || "Failed to fetch watchlist");
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid or missing authentication. Please log in again.");
        navigate("/");
      }
    }
  }, [navigate, userId, token, authenticated]);

  useEffect(() => {
    fetchWatchlistData();
  }, [fetchWatchlistData]);

  const handleDeleteWatchlist = (watchlistId) => {
    setWatchlistToDelete(watchlistId);
    deleteWatchlistModalRef.current.showModal();
  };

  const confirmDeleteWatchlist = async () => {
    if (!watchlistToDelete) return;
    console.log("Attempting to delete watchlist with ID:", watchlistToDelete);
    console.log("Token used for deleting watchlist:", token);
    try {
      await deleteWatchlist(watchlistToDelete, userId, token);
      console.log("Watchlist deleted successfully, updating state...");
      setWatchlist((prev) =>
        prev.filter((item) => item.id !== watchlistToDelete)
      );
      setWatchlistToDelete(null);
      deleteWatchlistModalRef.current.close();
      setError("");
      window.alert("Watchlist deleted successfully!");
    } catch (err) {
      console.error("Error deleting watchlist:", err);
      setError(err.error || "Failed to delete watchlist");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">My Watchlists</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {authenticated && (
        <div className="mb-8 flex justify-end">
          <Link to="/watchlist/create" className="btn btn-success text-white">
            Create Watchlist
          </Link>
        </div>
      )}
      {watchlist.length === 0 ? (
        <p className="text-gray-500">No watchlists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <UserWatchlistCard
              key={item.id}
              watchlist={item}
              onDelete={handleDeleteWatchlist}
            />
          ))}
        </div>
      )}

      <dialog
        id="delete_watchlist_modal"
        className="modal"
        ref={deleteWatchlistModalRef}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete this watchlist?
          </p>
          <div className="modal-action">
            <button
              onClick={confirmDeleteWatchlist}
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

export default Watchlist;
