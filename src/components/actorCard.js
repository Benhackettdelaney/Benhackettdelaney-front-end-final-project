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
      <div className="card-body">
        <h2 className="card-title">
          <Link to={`/actors/${actor.id}`} className="text-blue-500 underline">
            {actor.name || "Unknown Actor"}
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
          <strong>Movies:</strong> {actor.movie_count || 0}
        </p>
        {role === "admin" && (
          <div className="card-actions justify-end mt-2">
            <button
              onClick={() => onAddToMovie(actor.id)}
              className="btn btn-primary"
              disabled={!selectedMovieId}
            >
              Add to Movie
            </button>
            <Link to={`/actors/${actor.id}/edit`} className="btn btn-warning">
              Edit
            </Link>
            <button
              onClick={() => onDelete(actor.id)}
              className="btn btn-error"
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
