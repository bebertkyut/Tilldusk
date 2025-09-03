"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { SeasonTheme } from "../../components/SeasonTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SpringIcon,
  SummerIcon,
  AutumnIcon,
  WinterIcon,
} from "@/components/SeasonIcons";

export default function Home() {
  const { season, setSeason, mode, setMode } = useTheme();

  // Dummy data
  const user = { name: "Jane Doe", bio: "Fullstack Dev", avatar: "/avatar.png" };
  const posts = [
    { id: 1, title: "My First Blog", excerpt: "This is about my journey..." },
    { id: 2, title: "Next.js Tips", excerpt: "Some tips I’ve learned..." },
  ];
  const notifications = ["New follower: John", "Your post got 5 likes"];
  const followers = [
    { id: 1, name: "John", avatar: "/john.png" },
    { id: 2, name: "Sarah", avatar: "/sarah.png" },
  ];

  return (
    <>
      <SeasonTheme />

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-4 mb-8 bg-transparent z-50">
        {/* Left side: logo + title */}
        <div className="flex items-center gap-2">
          <Image
            src={mode === "dark" ? "/logo-dark.svg" : "/logo.svg"}
            alt="Tildusk Owl Logo"
            width={32}
            height={32}
          />
          <span
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Tildusk
          </span>
        </div>

        {/* Right side: season select + mode toggle + home link */}
        <div className="flex items-center gap-2">
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger
              className={`min-w-fit w-12 rounded-xl px-2 py-2 border-0 shadow-sm bg-[var(--color-surface)] ${
                mode === "dark" ? "shadow-white/20" : "shadow-lg"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={`min-w-fit w-12 border-0 shadow-lg bg-[var(--color-surface)] ${
                mode === "dark" ? "shadow-white/20" : ""
              }`}
            >
              <SelectItem value="spring"><SpringIcon /></SelectItem>
              <SelectItem value="summer"><SummerIcon /></SelectItem>
              <SelectItem value="autumn"><AutumnIcon /></SelectItem>
              <SelectItem value="winter"><WinterIcon /></SelectItem>
            </SelectContent>
          </Select>

          {/* Mode toggle */}
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 font-semibold">
              {mode === "light" ? "Light" : "Dark"}
            </span>
            <button
              type="button"
              aria-pressed={mode === "dark"}
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                mode === "dark" ? "" : "bg-gray-300"
              }`}
              style={mode === "dark" ? { backgroundColor: "var(--color-primary)" } : {}}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  mode === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          <Link
            href="/"
            className="button-primary px-4 py-2 text-white rounded font-semibold hover:opacity-90 transition"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Main 3-column layout */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[var(--color-background)] min-h-screen pt-20">
        {/* Left Sidebar (Profile + Followers) */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow min-h-80 flex flex-col justify-center">
            <Image
              src={user.avatar}
              alt={user.name}
              width={80}
              height={80} 
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="text-center text-lg font-bold mt-2">{user.name}</h2>
            <p className="text-center text-sm">{user.bio}</p>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Followers</h3>
            <div className="flex flex-wrap gap-2">
              {followers.map((f) => (
                <div key={f.id} className="flex items-center gap-2">
                  <Image
                    src={f.avatar}
                    alt={f.name}
                    width={20}
                    height={20} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed (Posts) */}
        <section className="md:col-span-2 space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[var(--color-surface)] p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.excerpt}</p>
            </article>
          ))}
        </section>

        {/* Right Sidebar (Notifications + Suggestions) */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Notifications</h3>
            <ul className="space-y-2">
              {notifications.map((note, i) => (
                <li key={i} className="text-sm">
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Suggested Follows</h3>
            <p className="text-sm text-gray-600">
              More people to connect with…
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
