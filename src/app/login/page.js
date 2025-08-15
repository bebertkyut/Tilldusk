"use client";
import Link from "next/link";
import { useTheme } from "../ThemeContext";
import { useEffect } from "react";

const themeMap = {
  spring: { light: "light-spring", dark: "dark-spring" },
  summer: { light: "light-summer", dark: "dark-summer" },
  autumn: { light: "light-autumn", dark: "dark-autumn" },
  winter: { light: "light-winter", dark: "dark-winter" },
};

export default function LoginPage() {
  const { season, mode } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMap[season][mode]);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [season, mode]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
      <div className="flex gap-4 mb-6">
        <button
          className="px-4 py-2 bg-pink-500 text-white rounded font-semibold hover:bg-pink-600 transition"
          onClick={() => alert("Logged out!")}
        >
          Logout
        </button>
      </div>
      <Link
        href="/"
        className="px-4 py-2 bg-white text-blue-500 rounded font-semibold hover:bg-blue-100 transition"
      >
        Home
      </Link>
    </main>
  );
}