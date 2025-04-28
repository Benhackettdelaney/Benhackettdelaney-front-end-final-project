import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchCurrentUser, fetchMovie, updateMovie } from "../../apis/movie";
import { fetchAllActors } from "../../apis/actor";

function MovieEdit({ authenticated }) {
  const { movieId } = useParams();
  const [formData, setFormData] = useState({
    movie_title: "",
    movie_genres: "",
    description: "",
    actor_id: "",
    image: "bloodborne1.jpg",
  });
  const [actors, setActors] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Children",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Film-Noir",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to continue");
      setLoading(false);
      navigate("/");
      return;
    }

    if (!movieId) {
      setError("No movie ID provided");
      setLoading(false);
      navigate("/movies");
      return;
    }

    const checkUserRoleAndFetchData = async () => {
      try {
        const userData = await fetchCurrentUser(token);
        setIsAdmin(userData.role === "admin");

        const movieData = await fetchMovie(movieId, token);
        setFormData({
          movie_title: movieData.movie_title,
          movie_genres: genres.includes(movieData.movie_genres)
            ? movieData.movie_genres
            : "",
          description: movieData.description || "",
          actor_id: movieData.actors[0]?.id || "",
          image: "bloodborne1.jpg",
        });

        const actorData = await fetchAllActors(token);
        setActors(actorData);
      } catch (err) {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load movie data");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRoleAndFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, navigate, authenticated, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.movie_title.trim()) return "Movie title is required";
    if (!formData.movie_genres) return "Genre is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.actor_id) return "Actor is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !authenticated) {
      setError("Only admins can edit movies");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = {
      movie_title: formData.movie_title,
      movie_genres: formData.movie_genres,
      description: formData.description,
      actor_id: formData.actor_id,
      image: formData.image,
    };

    try {
      await updateMovie(movieId, data, token);
      setError("");
      navigate("/movies");
      window.alert("Movie updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update movie");
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  const errStyle = { color: "red" };

  return (
    <div className="container mx-auto mt-10 flex flex-col items-center space-y-12">
      <h2 className="text-4xl">Edit Movie</h2>
      {error && (
        <p style={errStyle} className="text-center">
          {error}
        </p>
      )}
      {!isAdmin || !authenticated ? (
        <p style={errStyle} className="text-center max-w-md">
          You must be an admin to edit movies. Please log in with an admin
          account.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6"
        >
          <input
            type="text"
            name="movie_title"
            placeholder="Movie Title"
            value={formData.movie_title}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
            required
          />
          <select
            name="movie_genres"
            value={formData.movie_genres}
            onChange={handleChange}
            className="select select-bordered w-full max-w-xs"
            required
          >
            <option value="">Select a Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs h-24"
            required
          />
          <select
            name="actor_id"
            value={formData.actor_id}
            onChange={handleChange}
            className="select select-bordered w-full max-w-xs"
            required
          >
            <option value="">Select an Actor</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="image" value="bloodborne1.jpg" />
          <button type="submit" className="btn btn-active">
            Update Movie
          </button>
        </form>
      )}
      <Link to="/movies" className="underline text-blue-500">
        Back to Movies
      </Link>
    </div>
  );
}

export default MovieEdit;
