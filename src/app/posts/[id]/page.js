"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          created_at,
          users(
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!post) return <p className="text-center mt-8">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-10 h-10">
          <Image
            src={post.users?.avatar_url || "/default-avatar.png"}
            alt={post.users?.display_name || "User"}
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <h2 className="font-semibold text-lg">
            {post.users?.display_name || post.users?.username}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
