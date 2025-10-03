import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from("users")
        .select("id, display_name, bio, username, avatar_url, banner, season, mode")
        .limit(1)
        .single();
      if (data) setProfile(data);
    }
    fetchProfile();
  }, []);

  return { profile };
}