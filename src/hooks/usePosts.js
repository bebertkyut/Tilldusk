import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePosts(userId) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      return;
    }
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, user_id")
      .eq("user_id", userId);
    setPosts(data || []);
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, fetchPosts };
}