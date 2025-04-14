// src/context/TmdbContext.js
import React, { createContext, useContext } from "react";

const TmdbContext = createContext(null);

export const TmdbProvider = ({ children }) => {
  const TMDB_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhjYmRmNzBhNTk2OThlYmZhNTNmNzUxMGE0MTRiZSIsIm5iZiI6MTc0MjkwMjE5MS4yMjgsInN1YiI6IjY3ZTI5M2FmYTYzYmNjNDk5N2RjNmIwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eBeNQ60kBlJxVaKkO6xCAoglWjGhmNutVOzw5WS-ElY";

  return (
    <TmdbContext.Provider value={{ TMDB_TOKEN }}>
      {children}
    </TmdbContext.Provider>
  );
};

export const useTmdb = () => useContext(TmdbContext);
