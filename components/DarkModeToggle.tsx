import { useState, useEffect } from 'react';

/**
 * Button to toggle the `dark` class on the document root.
 */
export default function DarkModeToggle() {
  // Check for user’s dark mode preference on mount
  const [enabled, setEnabled] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  function toggle() {
    setEnabled(prev => {
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
  }

  // Optional: keep state in sync with manual theme change
  useEffect(() => {
    setEnabled(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      data-testid="dark-mode-toggle"
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 shadow hover:scale-110 transition-all font-medium"
    >
      {enabled ? (
        <>
          <span role="img" aria-label="Light mode">☀️</span> Light Mode
        </>
      ) : (
        <>
          <span role="img" aria-label="Dark mode">🌙</span> Dark Mode
        </>
      )}
    </button>
  );
}
