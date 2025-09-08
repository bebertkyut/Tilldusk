"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { SeasonTheme } from "../../components/SeasonTheme"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push("/home")
    }
    setLoading(false)
  }

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/home",
      },
    })
    if (error) setError(error.message)
  }

  return (
    <>
      <SeasonTheme />
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
              Sign in to Tildusk
            </span>
          </h1>

          {/* Username & Password */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--color-text)] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
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
              onClick={handleSignIn}
              disabled={loading}
              className="w-full rounded-md px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              style={{ background: `var(--color-primary)` }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              onClick={() => router.push("/signUp")}
              disabled={loading}
              className="w-full rounded-md px-4 py-2 text-black font-medium hover:bg-indigo-700 transition"
              style={{ background: `var(--color-accent)` }}
            >
              Sign up
            </button>
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
            Sign in with GitHub
          </button>
        </div>
      </main>
    </>
  )
}
