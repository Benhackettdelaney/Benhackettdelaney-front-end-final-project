import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCurrentUser, createMovie } from "../../apis/movie";
import { fetchAllActors } from "../../apis/actor";

function MovieCreate({ authenticated }) {
  // State for form data, actors, errors, admin check, and loading state
  const [formData, setFormData] = useState({
    id: "",
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

  // Movie genre options
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

  // Fetch user and actors when the component loads
  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to continue");
      setLoading(false);
      navigate("/"); // Redirect if not logged in
      return;
    }

    const checkUserRoleAndFetchActors = async () => {
      try {
        const userData = await fetchCurrentUser(token); // Fetch current user info
        setIsAdmin(userData.role === "admin"); // Check if the user is an admin

        const actorData = await fetchAllActors(token); // Fetch all actors
        setActors(actorData); // Store actors in state
      } catch (err) {
        console.error("Failed to fetch data:", err.response?.data);
        setError("Please log in to continue"); // Show error if fetching fails
        setIsAdmin(false); // Set user as not admin if error occurs
      } finally {
        setLoading(false); // Stop loading
      }
    };
    checkUserRoleAndFetchActors();
  }, [navigate, authenticated, token]);

  // Handle input change in the form
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Validate the form before submission
  const validateForm = () => {
    if (!formData.id.trim()) return "Movie ID is required";
    if (!formData.movie_title.trim()) return "Movie title is required";
    if (!formData.movie_genres) return "Genre is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.actor_id) return "Actor is required";
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !authenticated) {
      setError("Only admins can create movies");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Create movie and reset form
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
      navigate("/movies"); // Redirect to movies page
      window.alert("Movie created successfully!");
    } catch (err) {
      console.error("Movie create error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create movie");
    }
  };

  // Show loading message while data is being fetched
  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  // Error message style
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
