"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [season, setSeason] = useState("spring");
  const [mode, setMode] = useState("light");

  return (
    <ThemeContext.Provider value={{ season, setSeason, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}