import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]); // array of post IDs

  // Fetch all posts the user has favorited
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("post_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching favorites:", error);
      return;
    }

    setFavorites(data.map((f) => f.post_id));
  }, [userId]);

  // Add or remove favorite
  const toggleFavorite = useCallback(
    async (postId) => {
      if (!userId) return;

      const isFavorited = favorites.includes(postId);

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("post_id", postId);

        if (!error) {
          setFavorites((prev) => prev.filter((id) => id !== postId));
        } else {
          console.error("Error removing favorite:", error);
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: userId, post_id: postId }]);

        if (!error) {
          setFavorites((prev) => [...prev, postId]);
        } else {
          console.error("Error adding favorite:", error);
        }
      }
    },
    [favorites, userId]
  );

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favorites, toggleFavorite, fetchFavorites };
}
