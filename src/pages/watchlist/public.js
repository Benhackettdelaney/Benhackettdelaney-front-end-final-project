// src/pages/PublicWatchlists.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PublicWatchlists() {
  const [watchlists, setWatchlists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicWatchlists = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/watchlists/public"
        ); // Assuming prefix /watchlists
        console.log("Public watchlists response:", response.data);
        setWatchlists(response.data);
      } catch (err) {
        console.error("Error fetching public watchlists:", err.response?.data);
        setError(
          err.response?.data?.error || "Failed to fetch public watchlists"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicWatchlists();
  }, []);

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  if (error)
    return <div className="container mx-auto mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">Public Watchlists</h2>
      {watchlists.length === 0 ? (
        <p>No public watchlists available.</p>
      ) : (
        <ul className="space-y-4">
          {watchlists.map((watchlist) => (
            <li key={watchlist.id} className="p-4 bg-white rounded shadow">
              <p>
                <Link
                  to={`/public-watchlists/${watchlist.id}`}
                  className="text-blue-500 hover:underline"
                >
                  <strong>{watchlist.title}</strong>
                </Link>{" "}
                by {watchlist.username}
              </p>
              <p>Movies: {watchlist.movie_ids.join(", ")}</p>
              <p>Visibility: Public</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/home"
        className="bg-gray-500 text-white p-2 rounded mt-4 inline-block"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default PublicWatchlists;
