"use client";

import { usePosts } from "@/hooks/usePosts";
import Post from "@/components/Post";

export default function PostsPage() {
  const { posts, loading, error } = usePosts();

  if (loading) return <p className="text-center py-10">Loading posts...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error.message}</p>;
  if (!posts || posts.length === 0)
    return <p className="text-center py-10">No posts yet. Be the first to write one!</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </main>
  );
}
