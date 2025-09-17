"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpringIcon, SummerIcon, AutumnIcon, WinterIcon } from "@/components/SeasonIcons";

export default function Landing() {
  const { season, setSeason, mode, setMode } = useTheme();
  const router = useRouter();

  return (
    <>
      <ThemeProvider
        initialSeason={profile?.season || "spring"}
        initialMode={profile?.mode || "light"}
      >
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
        {/* Right side: season select, toggle, login */}
        <div className="flex items-center gap-4">
          {/* Season select */}
          <div className="flex items-center">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger
                className={`min-w-fit w-12 rounded-xl px-2 py-2 border-0 shadow-sm bg-[var(--color-surface)] ${
                  mode === "dark" ? "shadow-white/20" : "shadow-lg"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={`min-w-fit w-12 border-0 shadow-lg bg-[var(--color-surface)] ${
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
          </div>
          {/* Toggle */}
          <div className="flex items-center min-w-[80px]">
            <span className="mr-2 font-semibold min-w-[48px] text-center">{mode === "light" ? "Light" : "Dark"}</span>
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
          </div>
          {/* Login */}
        </div>
      </nav>
      <section className="min-h-screen w-full flex flex-col md:flex-row items-center">
        <div className="flex-1 flex flex-col items-center md:items-end">
          <h1 className="text-4xl font-bold mb-6 text-center md:text-right">
            A place for stories, shaped by{" "}
            <span style={{ color: "var(--color-primary)" }}>seasons</span>
            , and souls.
          </h1>
          <p className="font-normal text-lg mb-2 text-center md:text-right">
            Wander freely, write deeply, and connect gently as the light begins to fade.
          </p>
            <button
              onClick={() => router.push("/signIn")}
              className="px-6 py-2 mt-2 text-lg text-white font-medium rounded-md transition"
              style={{ background: `var(--color-primary)`}}
            >
              Login
            </button>
        </div>
        <div className="flex-1 flex mt-8 md:mt-0 justify-center">
          <Image
            src="/landingPic1.png"
            alt="Landing"
            width={350}
            height={350}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
        
      </section>
      <section className="min-h-screen w-full flex items-center justify-center">
        <div
          className="w-full max-w-3xl flex flex-col items-center justify-center rounded-2xl shadow-2xl p-16"
          style={{ background: "var(--color-surface)" }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">
            The world moves fast, but you don’t have to
          </h1>
          <p className="font-normal text-lg text-center">
            Here, you can pause, linger, and let your words take the long way home.
          </p>
         <button
          onClick={() => router.push("/signUp")}
          className="px-6 py-2 mt-2 text-lg text-white font-medium rounded-md transition"
          style={{ background: `var(--color-secondary)` }}
        >
          Sign up
        </button>
        </div>
      </section>
      </ThemeProvider>
    </>
  );
}