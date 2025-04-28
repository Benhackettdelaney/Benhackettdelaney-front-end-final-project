
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createActor } from "../../apis/actor";

function ActorCreate({ authenticated }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !authenticated || role !== "admin") {
      setError("Only admins can create actors. Please log in as admin.");
      navigate("/");
      return;
    }

    try {
      await createActor(formData, token);
      navigate("/actors");
    } catch (err) {
      setError(err.message || "Failed to create actor");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Create New Actor</h2>
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
          />
        </div>
        <button type="submit" className="btn btn-success">
          Create Actor
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

export default ActorCreate;
