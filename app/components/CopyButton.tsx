"use client";
import { useState } from "react";

export function CopyButton({ text, label = "நகலெடு", className = "btn btn-ghost" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      aria-live="polite"
    >
      {done ? "✓ நகலெடுக்கப்பட்டது" : label}
    </button>
  );
}
