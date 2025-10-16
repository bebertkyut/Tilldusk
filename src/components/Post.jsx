"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Post({ post, full = false }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // TODO: Add logic to save/remove favorite in Supabase
  };

  const handleMessage = () => {
    // TODO: Later — open chat with post.author.id
  };

  return (
    <article
      className="bg-[var(--color-surface)] p-6 rounded-xl shadow hover:shadow-md transition"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {post.author?.avatar_url && (
          <Image
            src={post.author.avatar_url}
            alt={post.author?.display_name || "User avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">
            {post.author?.display_name || ""}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2
        className="text-xl text-[var(--color-text)] font-bold mb-2"
        style={{ fontFamily: "var(--font-title)" }}
      >
        {full ? (
          post.title
        ) : (
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        )}
      </h2>

      {/* Content */}
      <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line mb-4">
        {full
          ? post.content
          : post.content.slice(0, 180) + (post.content.length > 180 ? "..." : "")}
      </p>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex gap-4 mt-3">
        <button
          onClick={handleFavorite}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {isFavorite ? "Favorited" : "Favorite"}
        </button>

        <button
          onClick={handleMessage}
          className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Message
        </button>
      </div>
    </article>
  );
}