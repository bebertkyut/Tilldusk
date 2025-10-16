"use client";
import Image from "next/image";
import Link from "next/link";
import SettingsModal from "@/components/settingsModal";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ThemeProvider } from "@/context/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useGearSpinOnClick, useBellShakeOnClick } from "@/hooks/useAnimations";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GearIcon, BellIcon } from "@/components/ui/icons";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const [handleSettingsClick, spinMotion] = useGearSpinOnClick();
  const [handleBellShake, shakeMotion] = useBellShakeOnClick(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const openSettingsModal = () => setShowSettingsModal(true);

  const handleSettingsButtonClick = (e) => {
    handleSettingsClick(e);
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          created_at,
          users(
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

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
      <div 
        className="max-w-3xl mx-auto p-6 space-y-6 mt-20 bg-[var(--color-surface)] rounded-xl shadow"
        style={{fontFamily: "var(--font-sans)"}}
      >      
        {/* Post Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10">
            <Image
              src={post.users?.avatar_url || "/default-avatar.png"}
              alt={post.users?.display_name || "User"}
              fill
              className="rounded-full object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {post.users?.display_name || post.users?.username}
            </h2>
            <p className="text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <h1 
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {post.title}
        </h1>
        <p className="leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>
    </ThemeProvider>
  );
}
