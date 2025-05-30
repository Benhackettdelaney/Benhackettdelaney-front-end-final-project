import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllActors, addActorToMovie, deleteActor } from "../../apis/actor";
import { fetchAllMovies } from "../../apis/movie";
import ActorCard from "../../components/actorCard";

function ActorsAll({ authenticated }) {
  // state variables
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
    // if not logged in, redirect
    if (!token || !authenticated) {
      setError("Please log in to view this page");
      navigate("/");
      return;
    }

    // fetch actors and movies
    const fetchData = async () => {
      try {
        const actorsData = await fetchAllActors(token);
        setActors(actorsData);

        const moviesData = await fetchAllMovies(token);
        setMovies(moviesData);
      } catch (err) {
        // handle errors
        console.error("Fetch data error:", err);
        setError(err.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchData();
  }, [token, authenticated, navigate]);

  const handleAddToMovie = async (actorId) => {
    // only admins can add actors
    if (!role || role !== "admin") {
      setError("Only admins can add actors to movies");
      return;
    }
    // check if movie is selected
    if (!selectedMovieId) {
      setError("Please select a movie");
      return;
    }

    try {
      // add actor to movie
      await addActorToMovie(selectedMovieId, actorId, token);
      setError("");
      window.alert("Actor added to movie successfully!");
    } catch (err) {
      // handle errors when adding actor
      console.error("Add to movie error:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.error || "Failed to add actor to movie");
    }
  };

  const handleDelete = (actorId) => {
    // only admins can delete actors
    console.log("Delete button triggered in ActorsAll for actor ID:", actorId, {
      timestamp: new Date().toISOString(),
      role: role,
      callStack: new Error().stack,
    });
    if (!role || role !== "admin") {
      setError("Only admins can delete actors");
      console.log("Non-admin attempted delete for actor ID:", actorId);
      return;
    }
    // set actor to delete
    setActorToDelete(actorId);
    setError("");
    deleteActorModalRef.current.showModal(); // show modal
  };

  const confirmDeleteActor = async () => {
    // confirm and delete actor
    if (!actorToDelete) return;
    try {
      console.log("Confirming deletion for actor ID:", actorToDelete, {
        timestamp: new Date().toISOString(),
      });
      await deleteActor(actorToDelete, token); // delete actor
      setActors(actors.filter((a) => a.id !== actorToDelete)); // remove from list
      setActorToDelete(null);
      deleteActorModalRef.current.close(); // close modal
      setTimeout(() => {
        window.alert("Actor deleted successfully!");
      }, 300);
      setError("");
    } catch (err) {
      // handle delete errors
      console.error("Delete actor error:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.error || "Failed to delete actor");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Actors</h2>
      {error && <div className="alert alert-error mb-6">{error}</div>}

      {role === "admin" && (
        <div className="mb-6 flex justify-between items-center">
          <div>
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
          <div>
            <Link to="/actors/create" className="btn btn-success text-white">
              Create New Actor
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actors.map((actor) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            role={role}
            selectedMovieId={selectedMovieId}
            onAddToMovie={handleAddToMovie}
            onDelete={handleDelete}
          />
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
