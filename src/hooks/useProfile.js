import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      // TODO: Replace with actual user id from auth
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, username, avatar_url, banner")
        .limit(1)
        .single();
      if (data) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return { profile, loading };
}