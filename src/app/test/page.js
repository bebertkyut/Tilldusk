"use client"
import { supabase } from "@/lib/supabaseClient"

export default function TestPage() {
  const handleTestInsert = async () => {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      alert("❌ You must be signed in first!")
      return
    }

    // Try inserting profile row
    const { data, error } = await supabase.from("profiles").insert([
      {
        id: user.id, // match auth.uid()
        display_name: "Test User",
        bio: "Hello! This is a test bio.",
        avatar_url: "https://example.com/avatar.png",
      },
    ])

    if (error) {
      console.error("Insert error:", error.message)
      alert("❌ Failed: " + error.message)
    } else {
      console.log("Insert success:", data)
      alert("✅ Row added successfully!")
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <button
        onClick={handleTestInsert}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Test Insert into Profiles
      </button>
    </main>
  )
}
