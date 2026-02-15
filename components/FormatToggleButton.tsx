import React from "react";

interface FormatToggleButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onMouseDown: (event: any) => void;
  children: React.ReactNode;
}

export default function FormatToggleButton({
  label,
  active = false,
  disabled = false,
  onMouseDown,
  children,
}: FormatToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={onMouseDown}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors disabled:opacity-50 ${
        active
          ? "border-sky-500 bg-sky-100 text-sky-900 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-100"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}
