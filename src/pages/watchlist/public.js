import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPublicWatchlists } from "../../apis/watchlist";
import PublicWatchlistCard from "../../components/publicWatchlistCard"

function PublicWatchlists() {
  const [watchlists, setWatchlists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublicWatchlists = async () => {
      try {
        const watchlistData = await fetchPublicWatchlists();
        setWatchlists(watchlistData);
      } catch (err) {
        console.error("Error fetching public watchlists:", err);
        setError(err.error || "Failed to fetch public watchlists");
      } finally {
        setLoading(false);
      }
    };

    loadPublicWatchlists();
  }, []);

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  if (error)
    return <div className="container mx-auto mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Public Watchlists
      </h2>
      {watchlists.length === 0 ? (
        <p className="text-gray-500">No public watchlists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlists.map((watchlist) => (
            <PublicWatchlistCard key={watchlist.id} watchlist={watchlist} />
          ))}
        </div>
      )}
      <Link to="/home" className="btn btn-neutral mt-6">
        Back to Home
      </Link>
    </div>
  );
}

export default PublicWatchlists;
