"use client";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getThemeKey } from "../app/utils/theme";

export function SeasonTheme() {
  const { season, mode } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getThemeKey(season, mode));
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [season, mode]);

  return null;
}