import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignOut from "../components/signOut"; 

function Profile({ authenticated, onAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to view your profile");
      setLoading(false);
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/auth/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err.response?.data);
        setError(err.response?.data?.error || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authenticated, navigate, token]);

  if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

  if (error) {
    return (
      <div className="container mx-auto mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white p-2 rounded mt-4"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (!userData)
    return (
      <div className="container mx-auto mt-10">No user data available</div>
    );

  const gender =
    userData.user_gender === 0
      ? "Male"
      : userData.user_gender === 1
      ? "Female"
      : "Unknown";

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl mb-4">User Profile</h2>
      <div className="p-4 bg-white rounded shadow space-y-4">
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
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
          <strong>User Rating:</strong> {userData.user_rating.toFixed(2)}
        </p>
        <p>
          <strong>Role:</strong> {userData.role}
        </p>
        <SignOut onAuthenticated={onAuthenticated} />
      </div>
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
