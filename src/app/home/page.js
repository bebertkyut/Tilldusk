"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { SeasonTheme } from "../../components/SeasonTheme";
import { useSpinOnClick } from "@/hooks/animations";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GearIcon } from "@/components/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SpringIcon,
  SummerIcon,
  AutumnIcon,
  WinterIcon,
} from "@/components/SeasonIcons";

export default function Home() {
  const { season, setSeason, mode, setMode } = useTheme();
  const { profile } = useProfile();
  const [handleGearClick, spinMotion] = useSpinOnClick();
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Toggle dropdown and spin
  const handleSettingsClick = (e) => {
    handleGearClick(showDropdown ? -1 : 1, e);
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const user = profile
    ? {
        name: profile.display_name,
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar_url || "/avatar.png",
        banner: profile.banner || null,
      }
    : { name: "", username: "", bio: "", avatar: "/avatar.png", banner: null };

  const posts = [
    { id: 1, title: "My First Blog", excerpt: "This is about my journey..." },
    { id: 2, title: "Next.js Tips", excerpt: "Some tips I’ve learned..." },
  ];
  const notifications = ["New follower: John", "Your post got 5 likes"];
  const followers = [
    { id: 1, name: "John", avatar: "/john.png" },
    { id: 2, name: "Sarah", avatar: "/sarah.png" },
  ];

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
          <span
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Tildusk
          </span>
        </div>

        {/* Right side: season select + mode toggle + home link */}
        <div className="flex items-center gap-2">
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
              <SelectItem value="spring"><SpringIcon /></SelectItem>
              <SelectItem value="summer"><SummerIcon /></SelectItem>
              <SelectItem value="autumn"><AutumnIcon /></SelectItem>
              <SelectItem value="winter"><WinterIcon /></SelectItem>
            </SelectContent>
          </Select>

          {/* Mode toggle */}
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 font-semibold">
              {mode === "light" ? "Light" : "Dark"}
            </span>
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
          <button
            type="button"
            className="ml-2 p-2 rounded-full transition group hover:bg-[var(--color-primary)/10] relative"
            aria-label="Settings"
            onClick={handleSettingsClick}
            ref={buttonRef}
          >
            <GearIcon
              as={motion.svg}
              width={24}
              height={24}
              className={`transition-colors group-hover:text-[var(--color-primary)] ${
                showDropdown
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text)]"
              }`}
              animate={spinMotion}
              transition={{ duration: 0.5, ease: "linear" }}
            />
            {showDropdown && (
            <div
              ref={dropdownRef}
              className="fixed top-[4.5rem] right-0 w-25 max-w-full bg-[var(--color-surface)] rounded shadow-lg z-50 py-2"
            >
              <div
                tabIndex={0}
                role="button"
                className="block w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-[var(--color-surface-hover)]"
                onClick={() => {/* handle settings click */}}
              >
                Settings
              </div>
              <div
                tabIndex={0}
                role="button"
                className="block w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-[var(--color-surface-hover)]"
                onClick={() => {/* handle logout click */}}
              >
                Logout
              </div>
            </div>
          )}
          </button>
        </div>
      </nav>

      {/* Main 3-column layout */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[var(--color-background)] min-h-screen pt-20">
        {/* Left Sidebar (Profile + Followers) */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-[var(--color-surface)] rounded-xl shadow min-h-80 relative overflow-hidden flex flex-col justify-start">
            {user.banner && (
              <Image
                src={user.banner}
                alt="Profile banner"
                width={400}
                height={120}
                className="absolute top-0 left-0 w-full h-[7.5rem] object-cover"
                priority
              />
            )}
            <div
              className="p-4 flex flex-row items-center justify-start gap-4 relative z-10"
              style={{ marginTop: '6rem' }}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full border-4 border-[var(--color-surface)] -mt-5"
                />
              </div>
              <div>
                <h2 className="text-left text-lg font-bold">{user.name}</h2>
                <p className="text-left text-xs line-clamp-2 mt-0">{user.username}</p>
              </div>
            </div>
            <div className="flex flex-col px-4">
              <span
                style={{ fontFamily: "var(--font-garamond)" }}
                className="italic font-bold text-lg ml-4"
              >
                and I Quote
              </span>
              <span
                style={{ fontFamily: "var(--font-garamond)" }}
                className="text-md mt-1 text-center"
              >
                “{user.bio || ""}”
              </span>
            </div>
            <div className="mt-5">
              <div className="flex gap-4 mt-1 justify-center mb-4">
                <span className="text-xs font-semibold">
                  {10} Following
                </span>
                <span className="text-xs font-semibold">
                  {10} Followers
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Followers</h3>
            <div className="flex flex-wrap gap-2">
              {followers.map((f) => (
                <div key={f.id} className="flex items-center gap-2">
                  <Image
                    src={f.avatar}
                    alt={f.name}
                    width={20}
                    height={20} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed (Posts) */}
        <section className="md:col-span-2 space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[var(--color-surface)] p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.excerpt}</p>
            </article>
          ))}
        </section>

        {/* Right Sidebar (Notifications + Suggestions) */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Notifications</h3>
            <ul className="space-y-2">
              {notifications.map((note, i) => (
                <li key={i} className="text-sm">
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Suggested Follows</h3>
            <p className="text-sm text-gray-600">
              More people to connect with…
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
