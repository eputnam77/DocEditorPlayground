import React from "react";

export interface ValidationResult {
  id: string | number;
  label: string;
  passed: boolean;
  detail?: string;
}

/**
 * Diagnostics results, marked up the way a reviewer marks up a draft.
 *
 * The summary line goes first so the outcome is readable at a glance - the
 * panel is rendered right under the "Run diagnostics" button, and the whole
 * point is immediate feedback that the run happened.
 */
export default function ValidationStatus({
  results,
  onClear,
}: {
  results: ValidationResult[];
  onClear?(): void;
}) {
  if (results.length === 0) return null;

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  return (
    <div className="dep-card dep-card--sunk" data-testid="validation-status">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="dep-eyebrow">Diagnostics</span>
          <span className="dep-mono" style={{ color: "var(--pass)" }}>
            {passed} pass
          </span>
          {failed > 0 && (
            <span className="dep-mono" style={{ color: "var(--fail)" }}>
              {failed} fail
            </span>
          )}
        </div>
        {onClear && (
          <button
            type="button"
            className="dep-btn dep-btn--quiet"
            onClick={onClear}
            aria-label="Clear diagnostics results"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="max-h-[22rem] overflow-y-auto">
        {results.map((result) => (
          <li
            key={result.id}
            className={`dep-check ${result.passed ? "dep-check--pass" : "dep-check--fail"}`}
          >
            <span className="dep-check__flag">
              {result.passed ? "PASS" : "FAIL"}
            </span>
            <span>
              <span className="dep-check__label">{result.label}</span>
              {result.detail && (
                <span className="dep-check__detail"> &mdash; {result.detail}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
