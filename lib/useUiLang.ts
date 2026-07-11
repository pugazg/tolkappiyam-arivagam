"use client";
import { useSyncExternalStore } from "react";

// The single source of truth for the UI language is the data-lang attribute on
// <html>, which LanguageToggle sets and persists. This hook lets client
// components read it (for cases that can't use the CSS-based <Bi> component,
// e.g. input placeholders and aria labels). It is NOT related to the tools'
// transliteration typing aid, which is a separate concern.
export type UiLang = "ta" | "en";

function subscribe(cb: () => void) {
  window.addEventListener("tk-lang-change", cb);
  return () => window.removeEventListener("tk-lang-change", cb);
}
function getSnapshot(): UiLang {
  return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ta";
}
function getServerSnapshot(): UiLang {
  return "ta";
}

export function useUiLang(): UiLang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
