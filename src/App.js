import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/components/login";
import Register from "../src/components/register";
import All from "../src/pages/movies";
import MovieSingle from "./pages/movies/single"; // Check this path

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/movies" element={<All />} />
          <Route path="/movies/:movieId" element={<MovieSingle />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
