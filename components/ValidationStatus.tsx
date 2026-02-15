import React from "react";

export interface ValidationResult {
  id: string | number;
  label: string;
  passed: boolean;
  detail?: string;
}

/**
 * Displays validation results with pass/fail status.
 * Non-obvious logic: results are rendered in a list with basic styling.
 */
export default function ValidationStatus({
  results,
  onClear,
}: {
  results: ValidationResult[];
  onClear?(): void;
}) {
  if (results.length === 0) return null;
  return (
    <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-slate-300 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Diagnostics results</span>
        {onClear && (
          <button className="text-xs font-semibold text-sky-700 underline dark:text-sky-300" onClick={onClear} aria-label="Clear diagnostics results">
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {results.map((r) => (
          <li key={r.id} className={r.passed ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
            <span className="font-medium">{r.label}:</span> {r.passed ? "Pass" : "Fail"}
            {r.detail && <span className="text-xs"> ({r.detail})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
