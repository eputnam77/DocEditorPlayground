import React, { useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "doceditorplayground.theme";

function readStoredTheme(): "dark" | "light" | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "dark" || value === "light") {
      return value;
    }
  } catch {
    // Ignore storage failures and fallback to DOM state.
  }
  return null;
}

function persistTheme(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, enabled ? "dark" : "light");
  } catch {
    // Ignore storage failures and keep runtime state.
  }
}

export default function DarkModeToggle() {
  const storedInitial = typeof window !== "undefined" ? readStoredTheme() : null;
  const initial =
    storedInitial === "dark" ||
    (storedInitial === null &&
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"));
  const [enabled, setEnabled] = useState<boolean>(initial);

  function toggle() {
    const next = !enabled;
    document.documentElement.classList.toggle("dark", next);
    persistTheme(next);
    setEnabled(next);
  }

  useEffect(() => {
    const stored = readStoredTheme();
    const next =
      stored === "dark" ||
      (stored === null && document.documentElement.classList.contains("dark"));
    document.documentElement.classList.toggle("dark", next);
    setEnabled(next);
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      data-testid="dark-mode-toggle"
      className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-300"
    >
      {enabled ? "Light mode" : "Dark mode"}
    </button>
  );
}
