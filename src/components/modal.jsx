"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const closeOnEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, [onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal content */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-[var(--color-surface)] text-[var(--color-text)] rounded-xl shadow-lg p-6 min-w-md relative">
          <button className="absolute top-2 right-2" onClick={onClose} aria-label="Close">
            ✖
          </button>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}