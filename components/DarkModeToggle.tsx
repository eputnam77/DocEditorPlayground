import { useState } from 'react';

/**
 * Simple button to toggle the `dark` class on the document root.
 */
export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  function toggle() {
    setEnabled(!enabled);
    document.documentElement.classList.toggle('dark', !enabled);
  }

  return (
    <button onClick={toggle} data-testid="dark-mode-toggle">
      {enabled ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
