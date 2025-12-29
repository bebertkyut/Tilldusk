import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError || new Error("No logged-in user"));
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("season, mode")
        .eq("id", user.id)
        .single();

      if (fetchError) setError(fetchError);
      else setSettings(data);

      setLoading(false);
    })();
  }, []);

  async function updateAesthetic({ season, mode }) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { ok: false, data: null, error: userError || new Error("No logged-in user") };

    const { data, error: updateError } = await supabase
      .from("users")
      .update({ season, mode })
      .eq("id", user.id)
      .select("season, mode")
      .single();

    if (updateError) return { ok: false, data: null, error: updateError };
    setSettings(data);
    return { ok: true, data, error: null };
  }

  async function updateSecurity({ password }) {
    if (!password) return { ok: false, data: null, error: new Error("Password is required") };
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, data: null, error };
    return { ok: true, data, error: null };
  }

  return { settings, loading, error, updateAesthetic, updateSecurity };
}