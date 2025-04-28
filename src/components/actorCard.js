import React from "react";
import { Link } from "react-router-dom";

const ActorCard = ({
  actor,
  role,
  selectedMovieId,
  onAddToMovie,
  onDelete,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-white p-6 space-y-3">
        <h2 className="card-title">
          <Link to={`/actors/${actor.id}`} className="text-blue-500 underline">
            {actor.name || "Unknown Actor"}
          </Link>
        </h2>
        <p>
          <strong>Description:</strong>{" "}
          <span className="opacity-70">{actor.description || "N/A"}</span>
        </p>
        <p>
          <strong>Previous Work:</strong>{" "}
          <span className="opacity-70">{actor.previous_work || "N/A"}</span>
        </p>
        <p>
          <strong>Birthday:</strong>{" "}
          <span className="opacity-70">
            {actor.birthday
              ? new Date(actor.birthday).toLocaleDateString()
              : "N/A"}
          </span>
        </p>
        <p>
          <strong>Nationality:</strong>{" "}
          <span className="opacity-70">{actor.nationality || "N/A"}</span>
        </p>
        <p>
          <strong>Movies:</strong>{" "}
          <span className="opacity-70">{actor.movie_count || 0}</span>
        </p>
        {role === "admin" && (
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => {
                onAddToMovie(actor.id);
                window.alert("Actor assigned to movie successfully!");
              }}
              className="btn btn-primary text-white"
              disabled={!selectedMovieId}
            >
              Add to Movie
            </button>
            <Link
              to={`/actors/${actor.id}/edit`}
              className="btn btn-warning text-white"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                onDelete(actor.id);
                window.alert("Actor deleted successfully!");
              }}
              className="btn btn-error text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorCard;
