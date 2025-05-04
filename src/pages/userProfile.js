import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignOut from "../components/signOut";
import { fetchCurrentUser } from "../apis/movie";

function Profile({ authenticated, onAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data when component mounts or when authentication changes
  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to view your profile");
      setLoading(false);
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    // Fetch the current user's data
    const getUserData = async () => {
      try {
        const data = await fetchCurrentUser(token); // Fetch data from API
        setUserData(data); // Store user data
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.error || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    getUserData(); // Call the function to fetch data
  }, [authenticated, navigate, token]);

  // Show a loading state if data is still being fetched
  if (loading)
    return <div className="container mx-auto mt-10 p-6">Loading...</div>;

  // Show an error message if there was an issue
  if (error) {
    return (
      <div className="container mx-auto mt-10 p-6">
        <p className="text-red-500 text-center">{error}</p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white p-2 rounded mt-4"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // If no user data is available, show a message
  if (!userData)
    return (
      <div className="container mx-auto mt-10 p-6 text-center">
        No user data available
      </div>
    );

  // Determine gender based on the value in userData
  const gender =
    userData.user_gender === 0
      ? "Male"
      : userData.user_gender === 1
      ? "Female"
      : "Unknown";

  return (
    <div className="container mx-auto mt-10 p-6 space-y-6 text-white text-center">
      <h2 className="text-3xl font-bold text-primary mb-6 text-left">
        User Profile
      </h2>
      <div className="w-40 h-40 rounded-full mx-auto mt-4 mb-4">
        <img
          src={
            userData.avatar_url ||
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="text-center text-lg mb-4">
        <p>
          <b>{userData.username}</b>
        </p>
      </div>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Age:</strong> {userData.raw_user_age}
      </p>
      <p>
        <strong>Gender:</strong> {gender}
      </p>
      <p>
        <strong>Role:</strong> {userData.role}
      </p>
      <div className="flex justify-center pt-4">
        <SignOut onAuthenticated={onAuthenticated} />
      </div>
      <div className="flex justify-center"></div>
      <button
        onClick={() => navigate("/home")}
        className="bg-gray-500 text-white p-2 rounded mt-4"
      >
        Back to Home
      </button>
    </div>
  );
}

export default Profile;
