import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useProfile() {
  const [profile, setProfile] = useState(null);

  // Upload to a bucket with a folder path, e.g. "profile/avatars/{userId}/..."
  const uploadToBucket = async (bucket, folder, file, userId) => {
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${folder}/${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) return { url: null, error: uploadError };
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      return { url: pub?.publicUrl || null, error: null };
    } catch (e) {
      return { url: null, error: e };
    }
  };

  const refresh = async (id) => {
    const base = supabase
      .from("users")
      .select("id, display_name, bio, username, avatar_url, banner, season, mode")
      .single();
    const { data, error } = id ? await base.eq("id", id) : await base;
    if (!error && data) setProfile(data);
    return { data, error };
  };

  const updateProfile = async (updates, id) => {
    const userId = id || profile?.id;
    if (!userId) return { data: null, error: new Error("No profile id") };
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, display_name, username, bio, avatar_url, banner, season, mode")
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  };

  useEffect(() => {
    refresh();
  }, []);

  return { profile, setProfile, refresh, updateProfile, uploadToBucket };
}