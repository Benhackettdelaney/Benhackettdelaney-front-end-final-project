import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MovieCard from "../../components/movieCard";
import { fetchAllMovies } from "../../apis/movie";

// main All component
function All({ authenticated, search, selectedGenre }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(32);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const role = localStorage.getItem("role");

  // run this when page path changes
  useEffect(() => {
    fetchMovies();
  }, [location.pathname]);

  // filter movies when search or genre changes
  useEffect(() => {
    let filtered = movies;

    // filter by search
    if (search && search.length > 1) {
      filtered = filtered.filter((movie) =>
        (movie.movie_title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by genre
    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        (movie.movie_genres || "")
          .toLowerCase()
          .includes(selectedGenre.toLowerCase())
      );
    }

    setFilteredMovies(filtered); // update list
    setVisibleMovies(32); // reset movie count
  }, [movies, search, selectedGenre]);

  // get movies from the backend
  const fetchMovies = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view movies");
      setIsLoading(false);
      return;
    }
    try {
      const moviesData = await fetchAllMovies(token);
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies");
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      }
    } finally {
      // small delay to keep spinner for a bit
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  // show more movies
  const handleShowMore = () => {
    setVisibleMovies((prev) => prev + 32);
  };

  // show fewer movies
  const handleShowLess = () => {
    setVisibleMovies((prev) => Math.max(32, prev - 32));
  };

  // show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full px-16 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Movies</h2>
        {authenticated && role === "admin" && (
          <Link to="/movies/create" className="btn btn-success text-white">
            Create New Movie
          </Link>
        )}
      </div>
      {error && <div className="alert alert-error mb-8">{error}</div>}
      {filteredMovies.length === 0 && search.length > 0 ? (
        <p className="text-center text-lg text-gray-500 mt-8">
          Movie not found
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-24 gap-y-12 relative z-10">
            {filteredMovies.slice(0, visibleMovies).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="text-center mt-8 flex justify-center gap-4">
            {visibleMovies < filteredMovies.length && (
              <button
                onClick={handleShowMore}
                className="btn btn-primary text-white"
              >
                Show More
              </button>
            )}
            {visibleMovies > 32 && (
              <button
                onClick={handleShowLess}
                className="btn btn-secondary text-white"
              >
                Show Less
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default All;
