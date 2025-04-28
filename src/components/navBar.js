import React, { useEffect, useState } from "react";
import { Link, useLocation, } from "react-router-dom";
import SignOut from "./signOut";

const Navbar = ({
  authenticated,
  onAuthenticated,
  search,
  onHandleChange,
  selectedGenre,
  onGenreSelect,
}) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("Navbar rendered for path:", location.pathname);
  }, [location.pathname]);

  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Children",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Film-Noir",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleGenreSelect = (genre) => {
    onGenreSelect(genre);
    setIsDropdownOpen(false); 
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to="/home" className="btn btn-ghost text-xl">
          MovieMuse
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/home" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/movies" className="hover:underline">
              Movies
            </Link>
          </li>
          <li>
            <Link to="/watchlist" className="hover:underline">
              Watchlist
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/public-watchlists" className="hover:underline">
              Public Watchlists
            </Link>
          </li>
          {role === "admin" && (
            <li>
              <Link to="/actors" className="hover:underline">
                Actors
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end flex gap-2">
        {location.pathname === "/movies" && (
          <>
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={onHandleChange}
              className="input input-bordered w-24 md:w-auto"
            />
            <div className="relative">
              <button className="btn btn-ghost" onClick={toggleDropdown}>
                Genres
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
                  <button
                    className={`w-full text-left p-2 ${
                      !selectedGenre ? "btn-active" : ""
                    }`}
                    onClick={() => handleGenreSelect("")}
                  >
                    All Genres
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      className={`w-full text-left p-2 ${
                        selectedGenre === genre ? "btn-active" : ""
                      }`}
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {authenticated && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <SignOut onAuthenticated={onAuthenticated} />
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/movies">Movies</Link>
            </li>
            <li>
              <Link to="/watchlist">Watchlist</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/public-watchlists">Public Watchlists</Link>
            </li>
            {role === "admin" && (
              <li>
                <Link to="/actors">Actors</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
