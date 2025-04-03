import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchActor, updateActor } from "../../apis/actor";

function ActorEdit({ authenticated }) {
  const { actorId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    previous_work: "",
    birthday: "",
    nationality: "",
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !authenticated || role !== "admin") {
      setError("Only admins can edit actors. Please log in as admin.");
      navigate("/");
      return;
    }

    const fetchActorData = async () => {
      try {
        const actor = await fetchActor(actorId, token);
        setFormData({
          name: actor.name,
          description: actor.description || "",
          previous_work: actor.previous_work || "",
          birthday: actor.birthday ? actor.birthday.split("T")[0] : "",
          nationality: actor.nationality || "",
        });
      } catch (err) {
        setError(err.message || "Failed to fetch actor");
      }
    };

    fetchActorData();
  }, [actorId, token, authenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateActor(actorId, formData, token);
      navigate("/actors");
    } catch (err) {
      console.error("Update error:", err); // Log full error for debugging
      setError(err.message || "Failed to update actor");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Edit Actor</h2>
      {error && <div className="alert alert-error mb-6">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="input input-bordered w-full"
            required
            maxLength={100} // Enforce max length
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            maxLength={500} // Enforce max length
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Previous Work</label>
          <input
            type="text"
            value={formData.previous_work}
            onChange={(e) =>
              setFormData({ ...formData, previous_work: e.target.value })
            }
            placeholder="Previous Work"
            className="input input-bordered w-full"
            maxLength={200} // Enforce max length
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Birthday</label>
          <input
            type="date"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Nationality</label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            placeholder="Nationality"
            className="input input-bordered w-full"
            maxLength={100} // Enforce max length
          />
        </div>
        <button type="submit" className="btn btn-success">
          Update Actor
        </button>
        <button
          type="button"
          onClick={() => navigate("/actors")}
          className="btn btn-secondary ml-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ActorEdit;
