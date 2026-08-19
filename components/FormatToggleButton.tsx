import React from "react";

interface FormatToggleButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  /** Keyboard shortcut shown in the tooltip, e.g. "Ctrl+B". */
  shortcut?: string;
  /** Render the label next to the icon instead of icon-only. */
  showLabel?: boolean;
  onMouseDown: (event: any) => void;
  children: React.ReactNode;
}

/**
 * A toolbar toggle that names itself.
 *
 * Icon-only buttons with nothing but a native `title` left users guessing what
 * they were about to click, so every button carries a styled tooltip with its
 * name and shortcut, plus `title` as the no-JS/no-hover fallback.
 */
export default function FormatToggleButton({
  label,
  active = false,
  disabled = false,
  shortcut,
  showLabel = false,
  onMouseDown,
  children,
}: FormatToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      onMouseDown={onMouseDown}
      className="dep-tool"
    >
      {children}
      {showLabel && <span className="dep-tool__text">{label}</span>}
      <span className="dep-tool__tip" aria-hidden="true">
        {label}
        {shortcut && <kbd>{shortcut}</kbd>}
      </span>
    </button>
  );
}
