"use client";

import Image from "next/image";
import Link from "next/link";

export default function Post({ post, full = false }) {
  // post = { id, title, content, created_at, author: { username, avatar_url } }

  return (
    <article
      className="bg-[var(--color-surface)] p-6 rounded-xl shadow hover:shadow-md transition"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Header (User Info + Date) */}
      <div className="flex items-center gap-3 mb-3">
        {post.author?.avatar_url && (
          <Image
            src={post.author.avatar_url}
            alt={post.author.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{post.author?.username || "Unknown"}</span>
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
      <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line">
        {full ? post.content : post.content.slice(0, 180) + (post.content.length > 180 ? "..." : "")}
      </p>
    </article>
  );
}
