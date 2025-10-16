"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeartIcon, HeartFilledIcon, MessageIcon } from "@/components/ui/icons";

export default function Post({ post, full = false }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // TODO: Add logic to save/remove favorite in Supabase
  };

  const handleMessage = () => {
    // TODO: Later — open chat with post.author.id
    alert("Message icon is clicked!");
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

      <div className="flex flex-row gap-4 mt-3">
        <button
          onClick={handleFavorite}
          className="flex-1 flex items-center justify-center text-xl gap-2"
          style={{ 
            fontFamily: "var(--font-garamond)",
            color: isFavorite ? "var(--color-accent)" : "var(--color-text)"
          }}
        >
          {isFavorite ? <HeartFilledIcon width={20} height={20} /> : <HeartIcon width={20} height={20} />}
          Favorite
        </button>

        <button
          onClick={handleMessage}
          className="flex-1 flex items-center justify-center text-xl gap-2"
          style={{ fontFamily: "var(--font-garamond)" }}
        >
          <MessageIcon width={20} height={20} />
          Message
        </button>
      </div>
    </article>
  );
}