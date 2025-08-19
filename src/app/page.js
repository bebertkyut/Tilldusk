"use client";
import Image from "next/image";
import Link from "next/link";
import { SeasonTheme } from "../components/SeasonTheme";
import { useTheme } from "../context/ThemeContext";


export default function Home() {
  const { season, setSeason, mode, setMode } = useTheme();

  return (
    <>
      <SeasonTheme />
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-4 mb-8 bg-transparent z-50">
        <div className="flex items-center gap-2">
          {/* Optimized SVG logo */}
          <Image src="/logo.svg" alt="Tildusk Owl Logo" width={32} height={32} />
          <span className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-title)" }}>
            Tildusk
          </span>
        </div>
      </nav>
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          A place for stories, shaped by{" "}
          <span style={{ color: "var(--color-primary)" }}>seasons</span>
          , and souls.
        </h1>
        <div className="flex gap-4 mb-6">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="px-4 py-2 rounded border"
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
          </select>
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 font-semibold">{mode === "light" ? "Light" : "Dark"}</span>
            <input
              type="checkbox"
              checked={mode === "dark"}
              onChange={() => setMode(mode === "light" ? "dark" : "light")}
              className="toggle-checkbox"
              style={{ width: 40, height: 20 }}
            />
          </label>
        </div>
        <Link
          href="/login"
          className="button-primary px-4 py-2 text-white rounded font-semibold hover:opacity-90 transition"
        >
          Login
        </Link>
      </main>
    </>
  );
}