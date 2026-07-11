"use client";
import { useSyncExternalStore } from "react";

type Lang = "ta" | "en";

function subscribe(cb: () => void) {
  window.addEventListener("tk-lang-change", cb);
  return () => window.removeEventListener("tk-lang-change", cb);
}
function getSnapshot(): Lang {
  const v = document.documentElement.getAttribute("data-lang");
  return v === "en" ? "en" : "ta";
}
function getServerSnapshot(): Lang {
  return "ta";
}

export function LanguageToggle() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function choose(next: Lang) {
    document.documentElement.setAttribute("data-lang", next);
    try { localStorage.setItem("tk-lang", next); } catch {}
    window.dispatchEvent(new Event("tk-lang-change"));
  }

  return (
    <div className="lang-switch" role="group" aria-label="Interface language / இடைமுக மொழி">
      <button type="button" aria-pressed={lang === "ta"} onClick={() => choose("ta")} lang="ta">தமிழ்</button>
      <button type="button" aria-pressed={lang === "en"} onClick={() => choose("en")} lang="en">EN</button>
    </div>
  );
}
