// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ authenticated, onAuthenticated, search, onHandleChange }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("Navbar rendered for path:", location.pathname);
  }, [location.pathname]);

  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <div
      className="bg-gray-800 text-white p-4 flex justify-between items-center"
      data-navbar="main"
    >
      <div className="flex space-x-4">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/movies" className="hover:underline">
          Movies
        </Link>
        <Link to="/watchlist" className="hover:underline">
          Watchlist
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {location.pathname === "/movies" && (
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={onHandleChange}
            className="p-2 rounded text-black"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
