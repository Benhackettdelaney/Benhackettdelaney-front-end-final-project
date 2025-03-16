// src/components/SignOut.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignOut({ onAuthenticated }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    axios
      .post("http://127.0.0.1:5000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        console.log("Token, UserId, and Role removed from localStorage");

        if (onAuthenticated) {
          onAuthenticated(false);
        }

        navigate("/");
      })
      .catch((err) => {
        console.error("Sign out error:", err);
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
