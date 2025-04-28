
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
          movie_genres: movieData.movie_genres,
          description: movieData.description || "",
          actor_id: movieData.actors[0]?.id || "",
          image: movieData.image_url
            ? movieData.image_url.split("/").pop()
            : "bloodborne1.jpg",
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
  }, [movieId, navigate, authenticated, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !authenticated) {
      setError("Only admins can edit movies");
      return;
    }

    const data = {
      movie_title: formData.movie_title,
      movie_genres: formData.movie_genres,
      description: formData.description,
      image: formData.image,
    };
    if (formData.actor_id) {
      data.actor_id = formData.actor_id;
    }

    try {
      await updateMovie(movieId, data, token);
      setError("");
      navigate("/movies");
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
          <input
            type="text"
            name="movie_genres"
            placeholder="Genres (comma-separated)"
            value={formData.movie_genres}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs h-24"
          />
          <select
            name="actor_id"
            value={formData.actor_id}
            onChange={handleChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Select an Actor (optional)</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="image" value={formData.image} />
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
