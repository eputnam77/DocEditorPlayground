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
    <div className="bg-yellow-50 border rounded shadow-md p-4 max-w-sm max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Validation Results</span>
        {onClear && (
          <button className="text-xs" onClick={onClear} aria-label="Clear validation results">
            Clear
          </button>
        )}
      </div>
      <ul className="text-sm">
        {results.map((r) => (
          <li key={r.id} className={r.passed ? "text-green-700" : "text-red-700"}>
            <span className="font-medium">{r.label}:</span> {r.passed ? "PASS" : "FAIL"}
            {r.detail && <span className="text-xs"> ({r.detail})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
