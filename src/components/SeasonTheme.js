"use client";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const themeMap = {
  spring: { light: "light-spring", dark: "dark-spring" },
  summer: { light: "light-summer", dark: "dark-summer" },
  autumn: { light: "light-autumn", dark: "dark-autumn" },
  winter: { light: "light-winter", dark: "dark-winter" },
};

export function SeasonTheme() {
  const { season, mode } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMap[season][mode]);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [season, mode]);

  // This component only handles theme switching logic now
  return null;
}