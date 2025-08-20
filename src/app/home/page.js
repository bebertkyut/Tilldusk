"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { SeasonTheme } from "../../components/SeasonTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpringIcon, SummerIcon, AutumnIcon, WinterIcon } from "@/components/SeasonIcons";

export default function Home() {
  const { season, setSeason, mode, setMode } = useTheme();

  return (
    <>
      <SeasonTheme />
      {/* Navbar */}
        <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-4 mb-8 bg-transparent z-50">
          {/* Left side: logo + title */}
          <div className="flex items-center gap-2">
            <Image
              src={mode === "dark" ? "/logo-dark.svg" : "/logo.svg"}
              alt="Tildusk Owl Logo"
              width={32}
              height={32}
            />
            <span className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-title)" }}>
              Tildusk
            </span>
          </div>
          {/* Right side: season select */}
          <div className="flex items-center gap-2">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger
                className={`min-w-fit w-12 rounded-xl px-2 py-2 focus:outline-none border-0 shadow-sm ${
                  mode === "dark" ? "shadow-white/20" : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={`min-w-fit w-12 focus:outline-none border-0 shadow-lg ${
                  mode === "dark" ? "shadow-white/20" : ""
                }`}
              >
                <SelectItem value="spring" className="flex items-center">
                  <SpringIcon />
                </SelectItem>
                <SelectItem value="summer" className="flex items-center">
                  <SummerIcon />
                </SelectItem>
                <SelectItem value="autumn" className="flex items-center">
                  <AutumnIcon />
                </SelectItem>
                <SelectItem value="winter" className="flex items-center">
                  <WinterIcon />
                </SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 font-semibold">{mode === "light" ? "Light" : "Dark"}</span>
              <button
                type="button"
                aria-pressed={mode === "dark"}
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  mode === "dark" ? "" : "bg-gray-300"
                }`}
                style={mode === "dark" ? { backgroundColor: "var(--color-primary)" } : {}}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    mode === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <Link
              href="/"
              className="button-primary px-4 py-2 text-white rounded font-semibold hover:opacity-90 transition"
            >
              Home
            </Link>
          </div>
        </nav>
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
        <div className="flex gap-4 mb-6">
        </div>
      </main>
    </>
  );
}