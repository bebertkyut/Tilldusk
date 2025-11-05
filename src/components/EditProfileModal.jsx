"use client";

import { useEffect, useState, useRef } from "react";
import Modal from "@/components/modal";
import { supabase } from "@/lib/supabaseClient";

export default function EditProfileModal({ isOpen, onClose, profile, onUpdated }) {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const avatarInputRef = useRef(null);

  // New: image state
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  
  useEffect(() => {
    if (!isOpen || !profile) return;
    setDisplayName(profile.display_name || "");
    setUsername(profile.username || "");
    setBio((profile.bio || "").slice(0, 200));
    setError("");
    // Reset image selections and previews
    setAvatarFile(null);
    setBannerFile(null);
    setAvatarPreview(profile.avatar_url || "");
    setBannerPreview(profile.banner || "");
  }, [isOpen, profile]);

  // New: file change handlers
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // Helper to upload to Supabase Storage
  const uploadImage = async (bucket, file, userId) => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${bucket}-${Date.now()}.${ext || "jpg"}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (uploadError) throw uploadError;
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return pub?.publicUrl;
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    setError("");

    try {
      let avatar_url = profile.avatar_url || "";
      let banner = profile.banner || "";

      // Upload selected images if any
      if (avatarFile) {
        avatar_url = await uploadImage("avatars", avatarFile, profile.id);
      }
      if (bannerFile) {
        banner = await uploadImage("banners", bannerFile, profile.id);
      }

      const { data, error } = await supabase
        .from("users")
        .update({
          display_name: displayName.trim(),
          username: username.trim(),
          bio,
          avatar_url,
          banner,
        })
        .eq("id", profile.id)
        .select("id, display_name, username, bio, avatar_url, banner, mode")
        .single();

      if (error) throw error;

      onUpdated?.(data);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit profile</h2>

        <div className="space-y-4">
          {/* Banner input (before Display name) */}
          <div>
            <span className="text-sm opacity-80">Banner</span>
            <div className="mt-1 relative w-full h-28 rounded-md overflow-hidden border border-[var(--color-surface-hover)]">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm opacity-60">
                  No banner selected
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onBannerChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Choose banner image"
              />
            </div>
          </div>

          {/* Avatar input (before Display name) */}
          <div>
          <div className="mt-1 relative w-full h-36 rounded-md overflow-hidden">
            <span className="absolute top-2 left-2 text-xs opacity-80">
              Profile picture
            </span>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={avatarPreview || "/default-avatar.png"}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border border-[var(--color-surface-hover)] cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => avatarInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    avatarInputRef.current?.click();
                  }
                }}
              />
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="hidden"
                aria-label="Choose profile image"
              />
            </div>
          </div>
        </div>

          {/* Display name */}
          <label className="block">
            <span className="text-sm opacity-80">Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--color-surface-hover)] bg-transparent px-3 py-2 outline-none focus:border-[var(--color-primary)]"
              placeholder="Your name"
            />
          </label>

          {/* Username */}
          <label className="block">
            <span className="text-sm opacity-80">Username</span>
            <div className="mt-1 flex items-center">
              <span className="px-3 py-2 rounded-l-md border border-r-0 border-[var(--color-surface-hover)] opacity-70 select-none">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 rounded-r-md border border-[var(--color-surface-hover)] bg-transparent px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                placeholder="username"
              />
            </div>
          </label>

          {/* Bio */}
          <label className="block">
            <span className="text-sm opacity-80">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              rows={4}
              maxLength={200}
              className="mt-1 w-full rounded-md border border-[var(--color-surface-hover)] bg-transparent px-3 py-2 outline-none focus:border-[var(--color-primary)]"
              placeholder="Tell us about yourself"
            />
            <div className="mt-1 text-xs opacity-70 text-right">
              {bio.length}/200
            </div>
          </label>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-[var(--color-surface-hover)] hover:opacity-90"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-70"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}