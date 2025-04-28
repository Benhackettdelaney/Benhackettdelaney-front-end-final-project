import React from "react";
import { useLocation, Link } from "react-router-dom";

function Footer() {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <footer className="bg-base-100 text-gray-500 text-center p-6 mt-8">
      <div className="container mx-auto">
        <p>
          <Link to="/movies" className="hover:underline">
            Movies
          </Link>{" "}
          |{" "}
          <Link to="/watchlist" className="hover:underline mx-2">
            Watchlists
          </Link>{" "}
          |{" "}
          <Link to="/home" className="hover:underline">
            Home
          </Link>{" "}
          |{" "}
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>{" "}
          |{" "}
          <Link to="/public-watchlists" className="hover:underline">
            Public Watchlists
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
