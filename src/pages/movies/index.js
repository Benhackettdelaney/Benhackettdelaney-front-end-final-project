import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../../components/movieCard";
import { fetchAllMovies } from "../../apis/movie"; 

function All({ authenticated, search }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(32);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!search || search.length <= 1) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.movie_title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
    setVisibleMovies(32);
  }, [movies, search]);

  const fetchMovies = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view movies");
      return;
    }
    try {
      const moviesData = await fetchAllMovies(token); // Use your API function
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies");
      console.error("Fetch error:", err.response?.data || err.message);
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
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.movie_title,
              genres: movie.movie_genres,
              ratingsCount: movie.ratings_count,
              reviewsCount: movie.reviews_count,
            }}
          />
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
