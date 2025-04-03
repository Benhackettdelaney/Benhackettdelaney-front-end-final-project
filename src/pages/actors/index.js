import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchAllActors,
  addActorToMovie,
  deleteActor,
} from "../../apis/actor";
import { fetchAllMovies } from "../../apis/movie";

function ActorsAll({ authenticated }) {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [error, setError] = useState("");
  const [actorToDelete, setActorToDelete] = useState(null);
  const deleteActorModalRef = useRef(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to view this page");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const actorsData = await fetchAllActors(token);
        setActors(actorsData);

        const moviesData = await fetchAllMovies(token);
        setMovies(moviesData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [token, authenticated, navigate]);

  const handleAddToMovie = async (actorId) => {
    if (!role || role !== "admin") {
      setError("Only admins can add actors to movies");
      return;
    }
    if (!selectedMovieId) {
      setError("Please select a movie");
      return;
    }

    try {
      await addActorToMovie(selectedMovieId, actorId, token);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add actor to movie");
    }
  };

  const handleDelete = (actorId) => {
    if (!role || role !== "admin") {
      setError("Only admins can delete actors");
      return;
    }
    setActorToDelete(actorId);
    deleteActorModalRef.current.showModal();
  };

  const confirmDeleteActor = async () => {
    if (!actorToDelete) return;
    try {
      await deleteActor(actorToDelete, token);
      setActors(actors.filter((a) => a.id !== actorToDelete));
      setActorToDelete(null);
      deleteActorModalRef.current.close();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete actor");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Actors</h2>
      {error && <div className="alert alert-error mb-6">{error}</div>}

      {role === "admin" && (
        <div className="mb-6 flex space-x-4">
          <Link to="/actors/create" className="btn btn-success">
            Create New Actor
          </Link>
          <select
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Movie to Add Actor</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.movie_title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actors.map((actor) => (
          <div key={actor.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <Link
                  to={`/actors/${actor.id}`}
                  className="text-blue-500 underline"
                >
                  {actor.name}
                </Link>
              </h2>
              <p>
                <strong>Description:</strong> {actor.description || "N/A"}
              </p>
              <p>
                <strong>Previous Work:</strong> {actor.previous_work || "N/A"}
              </p>
              <p>
                <strong>Birthday:</strong>{" "}
                {actor.birthday
                  ? new Date(actor.birthday).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Nationality:</strong> {actor.nationality || "N/A"}
              </p>
              <p>
                <strong>Movies:</strong> {actor.movie_count}
              </p>
              {role === "admin" && (
                <div className="card-actions justify-end mt-2">
                  <button
                    onClick={() => handleAddToMovie(actor.id)}
                    className="btn btn-primary"
                    disabled={!selectedMovieId}
                  >
                    Add to Movie
                  </button>
                  <Link
                    to={`/actors/${actor.id}/edit`}
                    className="btn btn-warning"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(actor.id)}
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <dialog
        id="delete_actor_modal"
        className="modal"
        ref={deleteActorModalRef}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this actor?</p>
          <div className="modal-action">
            <button onClick={confirmDeleteActor} className="btn btn-error mr-2">
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

export default ActorsAll;
