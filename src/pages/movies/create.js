// MovieCreate.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCurrentUser, createMovie } from "../../apis/movie";
import { fetchAllActors } from "../../apis/actor";

function MovieCreate({ authenticated }) {
  const [formData, setFormData] = useState({
    id: "",
    movie_title: "",
    movie_genres: "",
    description: "",
    actor_id: "",
    image: "bloodborne1.jpg", // Default to only available image
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

    const checkUserRoleAndFetchActors = async () => {
      try {
        const userData = await fetchCurrentUser(token);
        setIsAdmin(userData.role === "admin");

        const actorData = await fetchAllActors(token);
        setActors(actorData);
      } catch (err) {
        console.error("Failed to fetch data:", err.response?.data);
        setError("Please log in to continue");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserRoleAndFetchActors();
  }, [navigate, authenticated, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !authenticated) {
      setError("Only admins can create movies");
      return;
    }

    try {
      await createMovie(formData, token);
      setFormData({
        id: "",
        movie_title: "",
        movie_genres: "",
        description: "",
        actor_id: "",
        image: "bloodborne1.jpg",
      });
      setError("");
      navigate("/movies");
    } catch (err) {
      console.error("Movie create error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create movie");
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  const errStyle = { color: "red" };

  return (
    <div className="container mx-auto mt-10 flex flex-col items-center space-y-12">
      <h2 className="text-4xl">Create New Movie</h2>
      {error && (
        <p style={errStyle} className="text-center">
          {error}
        </p>
      )}
      {!isAdmin || !authenticated ? (
        <p style={errStyle} className="text-center max-w-md">
          You must be an admin to create movies. Please log in with an admin
          account.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6"
        >
          <input
            type="text"
            name="id"
            placeholder="Movie ID (e.g., tt1234567)"
            value={formData.id}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
            required
          />
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
            required
          >
            <option value="">Select an Actor</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          {/* Hidden input since only one image is available */}
          <input type="hidden" name="image" value={formData.image} />
          <button type="submit" className="btn btn-active">
            Create Movie
          </button>
        </form>
      )}
      <Link to="/movies" className="underline text-blue-500">
        Back to Movies
      </Link>
    </div>
  );
}

export default MovieCreate;
