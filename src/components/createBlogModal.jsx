import { ImgIcon, VideoIcon } from "@/components/ui/icons";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/useProfile";
import Modal from "./modal";

export default function CreateBlogModal({ isOpen, onClose }) {
  const { profile } = useProfile();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePost(e) {
  e.preventDefault();
  if (!title.trim() || !content.trim()) {
    alert("Title and content are required.");
    return;
  }
  setLoading(true);

  // Ensure user_id is present
  let userId = profile?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.getUser();
    userId = data?.user?.id;
    if (!userId) {
      alert("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }
  }

  const { error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        content,
        user_id: userId,
      },
    ]);
  setLoading(false);
  if (error) {
    alert("Failed to create post: " + error.message);
  } else {
    setTitle("");
    setContent("");
    onClose();
  }
}

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] max-w-3xl min-h-[60vh] p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>
        <form className="space-y-4" onSubmit={handleCreatePost}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter blog post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 rounded-md p-2 h-40"
              placeholder="Write your blog post content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
            />
          </div>
          <div
            className="flex-1 w-full flex items-center justify-between border border-[var(--color-text)] px-8 py-2 rounded-full bg-transparent"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span 
              className="select-none pointer-events-none"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Add media
            </span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full"
                aria-label="Add Image"
                style={{ color: "var(--color-accent)" }}
                onClick={e => {
                  e.stopPropagation();
                  alert("Image icon clicked");
                }}
                disabled={loading}
              >
                <ImgIcon width={20} height={20} />
              </button>
              <button
                type="button"
                className="p-2 rounded-full"
                aria-label="Add Video"
                style={{ color: "var(--color-accent)" }}
                onClick={e => {
                  e.stopPropagation();
                  alert("Video icon clicked");
                }}
                disabled={loading}
              >
                <VideoIcon width={20} height={20} />
              </button>
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[var(--color-secondary)]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-[var(--color-primary)]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}