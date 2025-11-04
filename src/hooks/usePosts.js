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
      .select(`
        id,
        title,
        content,
        created_at,
        user_id,
        author:users (
          display_name,
          username,
          avatar_url
        )
      `)
      .eq("user_id", userId);

    // Map user info to post.author for your Post component
    const postsWithAuthor = (data || []).map(post => ({
      ...post,
      author: post.users || {}
    }));

    setPosts(postsWithAuthor);
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, fetchPosts };
}