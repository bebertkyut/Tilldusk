"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { SeasonTheme } from "../../components/SeasonTheme";
import { useTheme } from "../../context/ThemeContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { season, mode } = useTheme(); // get season and mode

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/home",
    });
  };

  return (
    <>
      <SeasonTheme />
      <main className="flex min-h-screen items-center justify-center px-4" style={{ background: `var(--color-background)` }}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" style= {{ background: `var(--color-surface)` }}>
          {/* Title */}
          <h1 className="mb-6 text-center text-2xl font-bold" style={{ color: `var(--color-text)` }}>
            <span style={{ fontFamily: 'var(--font-title)'}}>Sign in to Tildusk</span>
          </h1>
          {/* Username & Password */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              style={{ background: `var(--color-primary)` }}
            >
              Sign in
            </button>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-black font-medium hover:bg-indigo-700 transition"
              style={{ background: `var(--color-secondary)` }}
            >
              Sign up
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/home" })}
            className="w-full rounded-md bg-black px-4 py-2 text-white font-medium hover:bg-gray-800 transition"
          >
            Sign in with GitHub
          </button>
        </div>
      </main>
    </>
  );
}
