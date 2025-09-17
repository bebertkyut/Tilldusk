"use client";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext"
import { useSettings } from "@/hooks/useSettings";
import Modal from "./modal";

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

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("aesthetic");
  const { season, setSeason, mode, setMode } = useTheme();
  const { settings, updateSettings } = useSettings();

  const handleSave = async () => {
    await updateSettings({ season, mode });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[70vw] min-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="flex gap-6">
          {/* Navigation */}
          <nav className="w-50 flex flex-col space-y-2 h-150 border-r border-gray-200 dark:border-gray-700 pr-4">
            <button
              onClick={() => setActiveTab("aesthetic")}
              className={`text-left px-2 py-1 rounded-md transition ${
                activeTab === "aesthetic"
                  ? "bg-[var(--color-primary)] text-white"
                  : "hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              Aesthetic
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`text-left px-2 py-1 rounded-md transition ${
                activeTab === "security"
                  ? "bg-[var(--color-primary)] text-white"
                  : "hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              Security
            </button>
          </nav>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {activeTab === "aesthetic" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <div className="flex items-center min-w-[80px]">
                    <span className="mr-2 font-semibold text-sm min-w-[48px] text-center">{mode === "light" ? "Light" : "Dark"}</span>
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Season</label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger className="w-[20vw] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] rounded-md border px-2 py-1 text-[var(--color-text)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--color-surface)] shadow-lg text-[var(--color-text)]">
                      <SelectItem value="spring"><SpringIcon />Spring</SelectItem>
                      <SelectItem value="summer"><SummerIcon />Summer</SelectItem>
                      <SelectItem value="autumn"><AutumnIcon />Autumn</SelectItem>
                      <SelectItem value="winter"><WinterIcon />Winter</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <button 
                  className="px-8 py-1.5 mt-2 bg-[var(--color-primary)] text-[var(--color-white)] text-sm hover:bg-[var(--color-primary-hover)] rounded-md"
                  onClick={handleSave}
                >
                    
                  Save
                </button>
              </>
            )}

            {activeTab === "security" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Change Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-[20vw] rounded-md border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Two-Factor Auth
                  </label>
                  <button className="rounded-md bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--color-primary-hover)] px-3 py-1">
                    Enable
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}