import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import axios from "axios";
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
import Footer from "./components/footer";
import PublicWatchlists from "./pages/watchlist/public";
import PublicWatchlistSingle from "./pages/watchlist/publicSingle";
import ActorsAll from "./pages/actors/index";
import ActorCreate from "./pages/actors/create";
import ActorEdit from "./pages/actors/edit";
import ActorSingle from "./pages/actors/single";

function App() {
  const [authenticated, setAuthenticated] = useState(false); // State for authentication status
  const [search, setSearch] = useState(""); // State for search input
  const [selectedGenre, setSelectedGenre] = useState(""); // State for selected genre

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId && role) {
      // If token, userId, and role exist, validate token
      axios
        .get("http://127.0.0.1:5000/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setAuthenticated(true); // Set user as authenticated
          // Store user details in localStorage
          localStorage.setItem("userId", response.data.user_id);
          localStorage.setItem("role", response.data.role);
        })
        .catch((err) => {
          setAuthenticated(false); // If error, set user as not authenticated
          localStorage.removeItem("token"); // Clear stored token
          localStorage.removeItem("userId"); // Clear stored userId
          localStorage.removeItem("role"); // Clear stored role
        });
    } else {
      setAuthenticated(false); // If no token, set user as not authenticated
    }
  }, []);

  // Function to handle authentication status change
  const onAuthenticated = (auth, authData) => {
    setAuthenticated(auth); // Set authentication status
    if (auth && authData) {
      // If authenticated, store token, userId, and role
      const { token, userId, role } = authData;
      const cleanToken = token.replace(/['"]+/g, "").trim();
      localStorage.setItem("token", cleanToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
    } else {
      // If not authenticated, remove stored data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }
  };

  // Function to handle search input change
  const onHandleChange = (e) => {
    setSearch(e.target.value);
  };

  // Function to handle genre selection
  const handleGenreSelect = (genre) => {
    // Toggle the genre filter
    setSelectedGenre(genre === selectedGenre ? "" : genre);
  };

  // Routes
  return (
    <Router>
      <Navbar
        authenticated={authenticated}
        onAuthenticated={onAuthenticated}
        search={search}
        onHandleChange={onHandleChange}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />
      <div className="min-h-screen bg-base-200">
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
            element={
              <All
                authenticated={authenticated}
                search={search}
                selectedGenre={selectedGenre}
              />
            }
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
          <Route
            path="/actors"
            element={<ActorsAll authenticated={authenticated} />}
          />
          <Route
            path="/actors/create"
            element={<ActorCreate authenticated={authenticated} />}
          />
          <Route
            path="/actors/:actorId/edit"
            element={<ActorEdit authenticated={authenticated} />}
          />
          <Route
            path="/actors/:actorId"
            element={<ActorSingle authenticated={authenticated} />}
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
          <Route path="/public-watchlists" element={<PublicWatchlists />} />
          <Route
            path="/public-watchlists/:id"
            element={<PublicWatchlistSingle />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
