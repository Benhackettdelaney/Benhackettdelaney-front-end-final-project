//libraries
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//components
import Login from "../src/components/login";
import Register from "../src/components/register";
//pages
import All from "../src/pages/movies";
import MovieSingle from "./pages/movies/single";
import MovieCreate from "./pages/movies/create";
import MovieEdit from "./pages/movies/edit";
import Watchlist from "./pages/watchlist";
import WatchlistSingle from "./pages/watchlist/single";
import WatchlistCreate from "./pages/watchlist/create";
import WatchlistEdit from "./pages/watchlist/edit";
import PageNotFound from "./pages/pageNotFound";
import Home from "./pages/home.js";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/movies" element={<All />} />
          <Route path="/movies/:movieId" element={<MovieSingle />} />
          <Route path="/movies/create" element={<MovieCreate />} />
          <Route path="/movies/:movieId/edit" element={<MovieEdit />} />{" "}
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watchlist/:watchlistId" element={<WatchlistSingle />} />
          <Route path="/watchlist/create" element={<WatchlistCreate />} />
          <Route
            path="/watchlist/:watchlistId/edit"
            element={<WatchlistEdit />}
          />{" "}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
