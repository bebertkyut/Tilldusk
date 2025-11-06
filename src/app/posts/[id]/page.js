"use client";
import Image from "next/image";
import Link from "next/link";
import Post from "@/components/Post";
import SettingsModal from "@/components/settingsModal";
import { useParams } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useGearSpinOnClick, useBellShakeOnClick } from "@/hooks/useAnimations";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GearIcon, BellIcon } from "@/components/ui/icons";
import { usePosts } from "@/hooks/usePosts";

export default function PostPage() {
  const { id } = useParams();
  const { profile } = useProfile();
  const [handleSettingsClick, spinMotion] = useGearSpinOnClick();
  const [handleBellShake, shakeMotion] = useBellShakeOnClick(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const openSettingsModal = () => setShowSettingsModal(true);
  const userId = profile?.id;
  const { posts } = usePosts(userId);
  const post = posts.find((p) => String(p.id) === String(id));
  const loading = !posts.length && !!userId;
 

  const handleSettingsButtonClick = (e) => {
    handleSettingsClick(e);
    setShowDropdown((prev) => !prev);
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!post) return <p className="text-center mt-8">Post not found.</p>;

  return (
    <ThemeProvider
      initialSeason={profile?.season}
      initialMode={profile?.mode}
    >
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-4 mb-8 bg-transparent z-50">
        {/* Left side: logo + title */}
        <Link href="/home" className="flex items-center gap-2 cursor-pointer" tabIndex={0}>
          <Image
            src={profile?.mode === "dark" ? "/logo-dark.svg" : "/logo.svg"}
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
        </Link>

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
            onClick={handleSettingsButtonClick}
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
      
      {/* Main Post Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6 mt-20">      
        <Post post={post} full={true}/>
      </div>
    </ThemeProvider>
  );
}