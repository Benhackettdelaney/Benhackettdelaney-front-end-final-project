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

  useEffect(() => {
    if (!token || !authenticated) {
      setError("Please log in to view your profile");
      setLoading(false);
      navigate("/");
      return;
    }

    const getUserData = async () => {
      try {
        const data = await fetchCurrentUser(token);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.error || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [authenticated, navigate, token]);

  if (loading)
    return <div className="container mx-auto mt-10 p-6">Loading...</div>;

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-6">
        <p className="text-red-500 text-center">error</p>
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

  if (!userData)
    return (
      <div className="container mx-auto mt-10 p-6 text-center">
        No user data available
      </div>
    );

  const gender =
    userData.user_gender === 0
      ? "Male"
      : userData.user_gender === 1
      ? "Female"
      : "Unknown";

  return (
    <div className="container mx-auto mt-10 p-6 space-y-6 text-white text-center">
      <h2 className="text-2xl mb-4 text-center">User Profile</h2>
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
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="bg-gray-500 text-white p-2 rounded mt-4"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Profile;
