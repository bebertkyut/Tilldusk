"use client"
import { useEffect } from "react"

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", closeOnEsc)
    return () => document.removeEventListener("keydown", closeOnEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[var(--color-surface)] text-[var(--color-text)] rounded-xl shadow-lg p-6 min-w-md relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}
