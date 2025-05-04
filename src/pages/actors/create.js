import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createActor, fetchCountries } from "../../apis/actor";

function ActorCreate({ authenticated }) {
  // State variables to store form data, countries, errors, loading state
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
  // Get token and role from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // If not logged in or authenticated, show an error and redirect
    if (!token || !authenticated) {
      setError("Please log in to continue");
      setLoading(false);
      navigate("/"); // Redirect to home page
      return;
    }

    // Check the user role and fetch countries
    const checkUserRoleAndFetchCountries = async () => {
      try {
        setIsAdmin(role === "admin"); // Check if user is an admin

        const countryData = await fetchCountries(token); // Fetch countries
        setCountries(countryData); // Set countries data
      } catch (err) {
        console.error("Failed to fetch countries:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load countries");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    // Call function to check role and fetch data
    checkUserRoleAndFetchCountries();
  }, [navigate, authenticated, token, role]);

  // Handle changes in input fields
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Update the respective field in formData
    }));
  };

  // Validate the form data before submitting
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // If user is not admin or not authenticated, show error
    if (!isAdmin || !authenticated) {
      setError("Only admins can create actors");
      return;
    }

    // Validate form data before submitting
    const validationError = validateForm();
    if (validationError) {
      setError(validationError); // If validation fails, show error
      return;
    }

    try {
      // Prepare the data to be sent to the API
      const requestData = {
        name: formData.name,
        description: formData.description || undefined,
        previous_work: formData.previous_work || undefined,
        birthday: formData.birthday || undefined,
        nationality: formData.nationality || undefined,
      };
      // Create the actor using the API
      await createActor(requestData, token);
      setFormData({
        name: "",
        description: "",
        previous_work: "",
        birthday: "",
        nationality: "",
      });
      setError("");
      navigate("/actors");
      window.alert("Actor created successfully!");
    } catch (err) {
      console.error("Actor create error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create actor");
    }
  };

  // Show loading message
  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  const errStyle = { color: "red" };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl mb-4">Create New Actor</h2>
      {error && (
        <p style={errStyle} className="mb-4">
          {error}
        </p>
      )}
      {!isAdmin || !authenticated ? (
        <p style={errStyle} className="text-center max-w-md">
          You must be an admin to create actors. Please log in with an admin
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
              Create Actor
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

export default ActorCreate;
