// ...existing code...
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { usePosts } from "@/hooks/usePosts";
import { useFavorites } from "@/hooks/useFavorites";
import ProfileView from "@/components/ProfileView.jsx";

export default function ProfilePage() {
  const { id } = useParams();
  const { posts } = usePosts(id);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("stories");
  const [currentUser, setCurrentUser] = useState(null);

  const { favorites, toggleFavorite } = useFavorites(currentUser?.id);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setCurrentUser(data?.user ?? null);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("id, display_name, username, bio, avatar_url, banner, mode, season")
        .eq("id", id)
        .single();

      if (!cancelled) {
        setProfile(data ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
      const { data } = await supabase.from("posts").select("*").in("id", favorites);
      if (!cancelled) {
        setFavoritePosts(data || []);
        setFavoritesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, favorites, currentUser]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <ProfileView
      profile={profile}
      posts={posts}
      favorites={favorites ?? []}
      favoritePosts={favoritePosts}
      favoritesLoading={favoritesLoading}
      currentUser={currentUser}
      onToggleFavorite={toggleFavorite}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showSettingsModal={showSettingsModal}
      setShowSettingsModal={setShowSettingsModal}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      onUpdated={(updated) => setProfile(updated)}
    />
  );
}
