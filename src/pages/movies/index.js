// src/pages/movies/index.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MovieCard from "../../components/movieCard";
import { fetchAllMovies } from "../../apis/movie";

function All({ authenticated, search, selectedGenre }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(32);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchMovies();
  }, [location.pathname]); // Refetch when navigating to /movies

  useEffect(() => {
    let filtered = movies;

    if (search && search.length > 1) {
      filtered = filtered.filter((movie) =>
        (movie.movie_title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        (movie.movie_genres || "")
          .toLowerCase()
          .includes(selectedGenre.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    setVisibleMovies(32);
  }, [movies, search, selectedGenre]);

  const fetchMovies = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view movies");
      return;
    }
    console.log("Token used for fetching movies:", token);
    try {
      const moviesData = await fetchAllMovies(token);
      console.log("Fetched movies:", moviesData);
      // Log specific movie for debugging
      const movie1546 = moviesData.find((movie) => movie.id === "1546");
      console.log("Movie ID 1546:", movie1546);
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
      console.error("Fetch error:", err.response?.data || err);
    }
  };

  const handleShowMore = () => {
    setVisibleMovies((prev) => prev + 32);
  };

  const handleShowLess = () => {
    setVisibleMovies((prev) => Math.max(32, prev - 32));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Movies</h2>
        {authenticated && (
          <Link to="/movies/create" className="btn btn-success">
            Create New Movie
          </Link>
        )}
      </div>
      {error && <div className="alert alert-error mb-8">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMovies.slice(0, visibleMovies).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="text-center mt-8 flex justify-center gap-4">
        {visibleMovies < filteredMovies.length && (
          <button onClick={handleShowMore} className="btn btn-primary">
            Show More
          </button>
        )}
        {visibleMovies > 32 && (
          <button onClick={handleShowLess} className="btn btn-secondary">
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}

export default All;
