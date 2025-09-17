// useSettings.js
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No logged in user:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("season, mode")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
      } else {
        setSettings(data);
      }

      setLoading(false);
    }

    fetchSettings();
  }, []);

  // Update settings
  async function updateSettings(updates) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No logged in user:", userError);
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      return null;
    }

    // update local state so UI reacts immediately
    setSettings(data);
    return data;
  }

  return { settings, loading, updateSettings };
}
