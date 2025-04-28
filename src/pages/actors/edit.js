import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchActor, updateActor, fetchCountries } from "../../apis/actor";

function ActorEdit({ authenticated }) {
  const { actorId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    previous_work: "",
    birthday: "",
    nationality: "",
  });
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to continue");
      setLoading(false);
      navigate("/");
      return;
    }

    if (!actorId) {
      setError("No actor ID provided");
      setLoading(false);
      navigate("/actors");
      return;
    }

    const checkUserRoleAndFetchData = async () => {
      try {
        setIsAdmin(role === "admin");

        const actorData = await fetchActor(actorId, token);
        setFormData({
          name: actorData.name,
          description: actorData.description || "",
          previous_work: actorData.previous_work || "",
          birthday: actorData.birthday || "",
          nationality: actorData.nationality || "",
        });

        const countryData = await fetchCountries(token);
        setCountries(countryData);
      } catch (err) {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load actor data");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRoleAndFetchData();
  }, [actorId, navigate, authenticated, token, role]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.description && formData.description.length > 500)
      return "Description must be 500 characters or less";
    if (formData.previous_work && formData.previous_work.length > 200)
      return "Previous work must be 200 characters or less";
    if (formData.birthday) {
      const date = new Date(formData.birthday);
      if (isNaN(date.getTime())) return "Invalid date";
      const minDate = new Date("1900-01-01");
      const maxDate = new Date();
      if (date < minDate || date > maxDate)
        return "Birthday must be between 1900 and today";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !authenticated) {
      setError("Only admins can edit actors");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        description: formData.description || undefined,
        previous_work: formData.previous_work || undefined,
        birthday: formData.birthday || undefined,
        nationality: formData.nationality || undefined,
      };
      await updateActor(actorId, requestData, token);
      setError("");
      navigate("/actors");
      window.alert("Actor updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update actor");
    }
  };

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  const errStyle = { color: "red" };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl mb-4">Edit Actor</h2>
      {error && (
        <p style={errStyle} className="mb-4">
          {error}
        </p>
      )}
      {!isAdmin || !authenticated ? (
        <p style={errStyle} className="text-center max-w-md">
          You must be an admin to edit actors. Please log in with an admin
          account.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-full max-w-xs">
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="w-full max-w-xs">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-24"
            />
          </div>
          <div className="w-full max-w-xs">
            <label className="block mb-1 font-semibold">Previous Work</label>
            <input
              type="text"
              name="previous_work"
              placeholder="Previous Work (optional)"
              value={formData.previous_work}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label className="block mb-1 font-semibold">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full max-w-xs">
            <label className="block mb-1 font-semibold">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select a Country (optional)</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-success mt-4">
              Update Actor
            </button>
            <button
              type="button"
              onClick={() => navigate("/actors")}
              className="btn btn-secondary mt-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <Link to="/actors" className="underline text-blue-500 mt-4 block">
        Back to Actors
      </Link>
    </div>
  );
}

export default ActorEdit;
