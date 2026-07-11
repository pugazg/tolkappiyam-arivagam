"use client";
import { useState } from "react";
import { CopyButton } from "./CopyButton";

export function CitationBlock({ full, compact }: { full: string; compact: string }) {
  const [mode, setMode] = useState<"full" | "compact">("full");
  const text = mode === "full" ? full : compact;
  return (
    <div className="card" style={{ background: "var(--paper-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <p className="eyebrow" style={{ margin: 0 }}>மேற்கோள் · Citation</p>
        <div className="pill-row">
          <button className="chip" style={{ cursor: "pointer", background: mode === "full" ? "var(--accent-wash)" : undefined }} onClick={() => setMode("full")}>முழு</button>
          <button className="chip" style={{ cursor: "pointer", background: mode === "compact" ? "var(--accent-wash)" : undefined }} onClick={() => setMode("compact")}>சுருக்கம்</button>
        </div>
      </div>
      <p className="tamil" style={{ fontSize: "0.95rem", color: "var(--ink-soft)", margin: "0.75rem 0" }}>{text}</p>
      <CopyButton text={text} label="மேற்கோளை நகலெடு" />
    </div>
  );
}
