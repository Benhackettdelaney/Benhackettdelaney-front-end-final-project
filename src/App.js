// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios"; // Added for token validation (optional)
import Login from "./components/login";
import Register from "./components/register";
import All from "./pages/movies";
import MovieSingle from "./pages/movies/single";
import MovieCreate from "./pages/movies/create";
import MovieEdit from "./pages/movies/edit";
import Watchlist from "./pages/watchlist";
import WatchlistSingle from "./pages/watchlist/single";
import WatchlistCreate from "./pages/watchlist/create";
import WatchlistEdit from "./pages/watchlist/edit";
import PageNotFound from "./pages/pageNotFound";
import Home from "./pages/home";
import Profile from "./pages/userProfile";
import Navbar from "./components/navBar";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId && role) {
      setAuthenticated(true);
      console.log("Restored auth state from localStorage:", {
        token,
        userId,
        role,
      });

      axios
        .get("http://127.0.0.1:5000/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Token validated:", response.data);
          localStorage.setItem("userId", response.data.user_id);
          localStorage.setItem("role", response.data.role);
        })
        .catch((err) => {
          console.error("Token validation failed:", err.response?.data);
          setAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
        });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(
        "Authenticated state:",
        authenticated,
        "Token:",
        localStorage.getItem("token"),
        "Role:",
        localStorage.getItem("role")
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const onAuthenticated = (auth, authData) => {
    setAuthenticated(auth);
    if (auth && authData) {
      const { token, userId, role } = authData;
      const cleanToken = token.replace(/['"]+/g, "").trim();
      localStorage.setItem("token", cleanToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      console.log("Token set in localStorage:", cleanToken);
      console.log("UserId set in localStorage:", userId);
      console.log("Role set in localStorage:", role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      console.log("Token, UserId, and Role removed from localStorage");
    }
  };

  const onHandleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Router>
      <Navbar
        authenticated={authenticated}
        onAuthenticated={onAuthenticated}
        search={search}
        onHandleChange={onHandleChange}
      />
      <div>
        <Routes>
          <Route
            path="/register"
            element={
              <Register
                authenticated={authenticated}
                onAuthenticated={onAuthenticated}
              />
            }
          />
          <Route
            path="/"
            element={
              <Login
                authenticated={authenticated}
                onAuthenticated={onAuthenticated}
              />
            }
          />
          <Route
            path="/movies"
            element={<All authenticated={authenticated} search={search} />}
          />
          <Route
            path="/movies/:movieId"
            element={<MovieSingle authenticated={authenticated} />}
          />
          <Route
            path="/movies/create"
            element={<MovieCreate authenticated={authenticated} />}
          />
          <Route
            path="/movies/:movieId/edit"
            element={<MovieEdit authenticated={authenticated} />}
          />
          <Route
            path="/watchlist"
            element={<Watchlist authenticated={authenticated} />}
          />
          <Route
            path="/watchlist/:watchlistId"
            element={<WatchlistSingle authenticated={authenticated} />}
          />
          <Route
            path="/watchlist/create"
            element={<WatchlistCreate authenticated={authenticated} />}
          />
          <Route
            path="/watchlist/:watchlistId/edit"
            element={<WatchlistEdit authenticated={authenticated} />}
          />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/home"
            element={
              <Home
                authenticated={authenticated}
                onAuthenticated={onAuthenticated}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                authenticated={authenticated}
                onAuthenticated={onAuthenticated}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
