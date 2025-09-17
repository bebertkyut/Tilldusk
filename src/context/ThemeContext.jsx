"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children, initialSeason = "spring", initialMode = "light" }) {
  const [season, setSeason] = useState(initialSeason);
  const [mode, setMode] = useState(initialMode);

  return (
    <ThemeContext.Provider value={{ season, setSeason, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}