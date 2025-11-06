"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function ProfileRedirect() {
  const { profile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile?.id) {
      router.replace(`/profile/${profile.id}`);
    }
  }, [profile, router]);

  return null;
}