
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignOut({ onAuthenticated }) {
  const navigate = useNavigate(); // for navigation after sign out

  // Handles sign out process
  const handleSignOut = () => {
    axios
      .post("http://127.0.0.1:5000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        // Remove token, userId, and role from localStorage after sign out
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        console.log("Token, UserId, and Role removed from localStorage");

        // Update authentication state and redirect to home page
        if (onAuthenticated) {
          onAuthenticated(false);
        }

        navigate("/"); // redirect to home page after sign out
      })
      .catch((err) => {
        console.error("Sign out error:", err); // log any error during sign out
      });
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white p-2 rounded"
    >
      Sign Out
    </button>
  );
}

export default SignOut;
