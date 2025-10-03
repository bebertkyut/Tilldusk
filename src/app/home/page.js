"use client";
import Image from "next/image";
import Link from "next/link";
import SettingsModal from "@/components/settingsModal";
import CreateBlogModal from "@/components/createBlogModal";
import { ThemeProvider } from "@/context/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useGearSpinOnClick, useBellShakeOnClick } from "@/hooks/useAnimations";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GearIcon, BellIcon, ImgIcon, VideoIcon } from "@/components/ui/icons";
import { getThemeKey } from "@/app/utils/theme";
import { usePosts } from "@/hooks/usePosts";

export default function Home() {
  const { profile } = useProfile();
  const { posts, fetchPosts } = usePosts(profile?.id); 
  const [handleGearClick, spinMotion] = useGearSpinOnClick();
  const [handleBellShake, shakeMotion] = useBellShakeOnClick(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [season, setSeason] = useState(profile?.season);
  const [mode, setMode] = useState(profile?.mode);
  
  useEffect(() => {
    if (profile) {
      setSeason(profile.season);
      setMode(profile.mode);
    }
  }, [profile]);

  // If profile changes, update season and mode
  useEffect(() => {
    const themeKey = getThemeKey(season, mode);
    document.documentElement.setAttribute("data-theme", themeKey);
  }, [season, mode]);

  // Toggle dropdown and spin
  const handleSettingsClick = (e) => {
    handleGearClick(e);
    setShowDropdown((prev) => !prev);
  };

  // Open settings modal and close dropdown
  const openSettingsModal = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowSettingsModal(true);
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
        avatar: profile.avatar_url,
        banner: profile.banner,
        season: profile.season,
        mode: profile.mode,
      }
    : { name: "", username: "", bio: "", avatar: null, banner: null, season: "", mode: "" };

  // const posts = [
  //   { id: 1, title: "My First Blog", excerpt: "This is about my journey..." },
  //   { id: 2, title: "Next.js Tips", excerpt: "Some tips I’ve learned..." },
  // ];
  const notifications = ["New follower: John", "Your post got 5 likes"];
  const followers = [
    { id: 1, name: "John", avatar: "/john.png" },
    { id: 2, name: "Sarah", avatar: "/sarah.png" },
  ];

  return (
    <>
      <ThemeProvider
        initialSeason={profile?.season}
        initialMode={profile?.mode}
      >
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-4 mb-8 bg-transparent z-50">
        {/* Left side: logo + title */}
        <div className="flex items-center gap-2">
          <Image
            src={mode === "dark" ? "/logo-dark.svg" : "/logo.svg"}
            alt="Tilldusk Owl Logo"
            width={32}
            height={32}
          />
          <span
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Tilldusk
          </span>
        </div>

        {/* Right side: season select + mode toggle + home link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ml-2 p-2 rounded-full transition group hover:bg-[var(--color-primary)/10] relative"
            aria-label="Notifications"
            onClick={handleBellShake}
          >
            <BellIcon
              as={motion.svg}
              width={24}
              height={24}
              className="transition-colors text-[var(--color-text)] group-hover:text-[var(--color-primary)]"
              animate={shakeMotion}
            />
          </button>
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
                  onClick={openSettingsModal}
                >
                  Settings
                </div>
                <Link
                  href="/"
                  className="block w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-[var(--color-surface-hover)]"
                >
                  Logout
                </Link>
              </div>
            )}
          </button>
          <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
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
                {user.avatar && (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-[var(--color-surface)] -mt-5"
                  />
                )}
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
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow flex flex-col gap-4">
            <div
              className="flex-1 w-full flex items-center justify-between border border-[var(--color-text)] hover:border-[var(--color-primary)] px-8 py-2 rounded-full cursor-text bg-transparent"
              style={{ fontFamily: "var(--font-sans)" }}
              tabIndex={0}
              role="button"
              onClick={() => {
                setShowCreateBlogModal(true);
                // handle main tile click (like focusing or opening a modal)
              }}
            >
              <span className="text-gray-500 select-none pointer-events-none">
                Write your own story...
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-full"
                  aria-label="Add Image"
                  style={{ color: "var(--color-accent)" }}
                  onClick={e => {
                    e.stopPropagation();
                    alert("Image icon clicked");
                    // handle image icon click
                  }}
                >
                  <ImgIcon width={20} height={20} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full"
                  aria-label="Add Video"
                  style={{ color: "var(--color-accent)" }}
                  onClick={e => {
                    e.stopPropagation();
                    alert("Video icon clicked");
                    // handle video icon click
                  }}
                >
                  <VideoIcon width={20} height={20} />
                </button>
              </span>
            </div>
          </div>
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[var(--color-surface)] p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <h2
              className="text-xl text-[var(--color-text)] font-semibold mb-2"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {post.title}
            </h2>
            <p
              className="text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {post.content}
            </p>
          </article>
        ))}
        </section>
        <CreateBlogModal
          isOpen={showCreateBlogModal}
          onClose={() => {
            setShowCreateBlogModal(false);
            fetchPosts();
          }}
       />
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
      </ThemeProvider>
    </>
  );
}
