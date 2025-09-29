"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useTheme } from "@/context/ThemeContext"

// Reusable modal inside this page
function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-2">Account Created 🎉</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your account has been created successfully.
        </p>
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successModal, setSuccessModal] = useState(false)
  const router = useRouter()
  const { season, mode } = useTheme() // <-- get current theme

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccessModal(true)
    }

    setLoading(false)
  }

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/home` },
    })
    if (error) setError(error.message)
  }

  return (
    <>
      <main
        className="flex min-h-screen items-center justify-center px-4"
        style={{ background: `var(--color-background)` }}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          style={{ background: `var(--color-surface)` }}
        >
          {/* Title */}
          <h1
            className="mb-6 text-center text-2xl font-bold"
            style={{ color: `var(--color-text)` }}
          >
            <span style={{ fontFamily: "var(--font-title)" }}>
              Sign up for Tildusk
            </span>
          </h1>

          {/* Display Name, Email & Password */}
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--color-text)] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--color-text)] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--color-text)] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              style={{ background: `var(--color-primary)` }}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>

            <div className="w-full text-center mt-2 text-sm text-[var(--color-text)]">
              Already have an account?{" "}
              <span
                className="text-indigo-700 hover:underline cursor-pointer font-medium"
                onClick={() => router.push("/signIn")}
                role="link"
                tabIndex={0}
              >
                Sign In
              </span>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-[var(--color-text)]"></div>
            <span className="mx-2 text-sm text-[var(--color-text)]">or</span>
            <div className="flex-grow border-t border-[var(--color-text)]"></div>
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={handleGitHubLogin}
            className="w-full rounded-md bg-black px-4 py-2 text-white font-medium hover:bg-gray-800 transition"
          >
            Sign up with GitHub
          </button>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal}
        onClose={() => {
          setSuccessModal(false)
          router.push("/signIn")
        }}
      />
    </>
  )
}
