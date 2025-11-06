"use client";
import Image from "next/image";
import Link from "next/link";
import SettingsModal from "@/components/settingsModal";
import EditProfileModal from "@/components/EditProfileModal";
import Post from "@/components/Post";
import { useParams } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { useGearSpinOnClick, useBellShakeOnClick } from "@/hooks/useAnimations";
import { motion } from "framer-motion";
import { GearIcon, BellIcon, PencilIcon } from "@/components/ui/icons";
import { supabase } from "@/lib/supabaseClient";
import { useFavorites } from "@/hooks/useFavorites";

export default function ProfilePage() {
  const { id } = useParams();
  const { posts } = usePosts(id);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handleSettingsClick, spinMotion] = useGearSpinOnClick();
  const [handleBellShake, shakeMotion] = useBellShakeOnClick();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const openSettingsModal = () => setShowSettingsModal(true);
  const [activeTab, setActiveTab] = useState("stories");
  const [currentUser, setCurrentUser] = useState(null);
  const { favorites, toggleFavorite } = useFavorites(currentUser?.id);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const handleSettingsButtonClick = (e) => {
    handleSettingsClick(e);
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setCurrentUser(data?.user ?? null);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, display_name, username, bio, avatar_url, banner, mode")
        .eq("id", id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab !== "favorites") return;
    if (!currentUser) return;

    if (!favorites || favorites.length === 0) {
      setFavoritePosts([]);
      return;
    }

    let cancelled = false;
    setFavoritesLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in("id", favorites);

      if (!cancelled) {
        setFavoritePosts(data || []);
        setFavoritesLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [activeTab, favorites, currentUser]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found.</div>;

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
            <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} profile={profile} onUpdated={setProfile} />
        </div>
    </nav>
    {/* Profile Content */}
    <div 
      className="max-w-xl mx-auto p-8 space-y-6 mt-20 bg-[var(--color-surface)] round-xl shadow-md"
      style={{ fontFamily: "var(--font-sans)" }}
      >
      {/* Banner and Avatar Overlap */}
      {profile.banner && (
        <div className="relative mb-4 -mx-8 -mt-8">
          <Image
            src={profile.banner}
            alt="Banner"
            width={600}
            height={180}
            className="object-cover round-t-xl w-full h-44"
          />
          {/* Avatar */}
          <div className="absolute left-8 -bottom-18 flex items-end">
            <Image
              src={profile.avatar_url || "/default-avatar.png"}
              alt={profile.display_name}
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-[var(--color-surface)] shadow-lg"
            />
            {/* Name and Username */}
            <div className="flex items-start ml-4 mb-3 gap-2">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">{profile.display_name}</h1>
                <p className="text-color-[var(--color-text)] text-lg">@{profile.username}</p>
              </div>
            </div>
          </div>

          {/* Edit pencil pinned to right edge */}
          {currentUser?.id === profile.id && (
            <button
              type="button"
              aria-label="Edit name"
              className="absolute right-8 -bottom-9 z-10 p-1 rounded-full transition hover:bg-[var(--color-primary)/10]"
              onClick={() => setShowEditModal(true)}
            >
              <PencilIcon
                width={20}
                height={20}
                className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
              />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col mt-20">
        <span
          style={{ fontFamily: "var(--font-garamond)" }}
          className="italic font-bold text-lg ml-4"
        >
          and I Quote
        </span>
        <span
          className="text-md mt-1 text-center"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          “{profile.bio}”
        </span>
      </div>
      <div className="flex gap-8 mt-8 mb-8 ml-4">
        <span className="text-md font-semibold">
          {10} Following
        </span>
        <span className="text-md font-semibold">
          {10} Followers
        </span>
      </div>
      <div className="sticky top-0 z-50 bg-[var(--color-surface)] pt-4 flex justify-between items-end w-full gap-0 mt-8 relative">
        {["stories", "favorites", "fan-favorite"].map((tab, idx) => (
          <button
            key={tab}
            className={`flex flex-col items-center text-md font-semibold cursor-pointer text-center flex-1 z-10 transition-colors duration-300
              ${activeTab === tab ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}
            `}
            onClick={() => setActiveTab(tab)}
            style={{ background: "none", border: "none", outline: "none" }}
            type="button"
          >
            {tab === "stories" && "Stories"}
            {tab === "favorites" && "Favorites"}
            {tab === "fan-favorite" && "Fan Favorite"}
          </button>
        ))}
        {/* Animated connecting line */}
        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--color-surface)] w-full z-0"></span>
        <span
          className="absolute bottom-0 h-0.5 rounded-full z-10 transition-all duration-300"
          style={{
            width: "33.3333%",
            left:
              activeTab === "stories"
                ? "0%"
                : activeTab === "favorites"
                ? "33.3333%"
                : "66.6666%",
            background: "var(--color-primary)",
          }}
        ></span>
      </div>
      {/* Stories */}
        {activeTab === "stories" && (
          <div className="mt-8 space-y-6">
            {posts.length === 0 ? (
              <div className="text-center text-gray-400">No posts yet.</div>
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  isFavorited={favorites.includes(post.id)}
                  onToggleFavorite={() => toggleFavorite(post.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === "favorites" && (
          <div className="mt-8 space-y-6">
            {!currentUser ? (
              <div className="text-center text-gray-400">Sign in to view favorites.</div>
            ) : favoritesLoading ? (
              <div className="text-center text-gray-400">Loading favorites...</div>
            ) : favoritePosts.length === 0 ? (
              <div className="text-center text-gray-400">No favorites yet.</div>
            ) : (
              favoritePosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  isFavorited={true}
                  onToggleFavorite={() => toggleFavorite(post.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

    </ThemeProvider>
  );
}