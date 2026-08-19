import React, { useMemo, useState } from "react";
import { OUTPUT_LABELS } from "./editorCatalog";

export type OutputFormat = "html" | "json" | "markdown";

export interface EditorOutputPanelProps {
  /** Editor name, used in the empty/unsupported messages. */
  editorName: string;
  /** Which format this editor treats as its source of truth. */
  nativeFormat: string;
  /**
   * A getter per format. Omit a format the editor cannot produce - the tab is
   * still shown, disabled, which is itself the interesting comparison.
   */
  getters: Partial<Record<OutputFormat, () => string>>;
  /** Formats this editor genuinely supports, in tab order. */
  available: OutputFormat[];
}

const ALL_FORMATS: OutputFormat[] = ["html", "json", "markdown"];

function formatFor(format: OutputFormat, raw: string): string {
  if (format !== "json") {
    return raw;
  }
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

/**
 * Shows what the current document looks like in each serialization format.
 *
 * This is the clearest single view of how the six editors differ: Editor.js has
 * no HTML source at all, Toast UI round-trips Markdown, TipTap and CKEditor are
 * HTML-first, and Slate and Lexical hand you a node tree.
 */
export default function EditorOutputPanel({
  editorName,
  nativeFormat,
  getters,
  available,
}: EditorOutputPanelProps) {
  const [format, setFormat] = useState<OutputFormat>(available[0] ?? "html");
  const [revision, setRevision] = useState(0);

  const output = useMemo(() => {
    const getter = getters[format];
    if (!getter) {
      return null;
    }
    try {
      return formatFor(format, getter() ?? "");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return `Could not read ${OUTPUT_LABELS[format]} output: ${message}`;
    }
    // `revision` is the refresh trigger: the getters read live editor state.
  }, [format, getters, revision]);

  return (
    <section data-testid="editor-output-panel">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="dep-eyebrow">Document output</h2>
          <p className="dep-muted mt-0.5">
            Source of truth for {editorName}: <strong>{nativeFormat}</strong>
          </p>
        </div>
        <button
          type="button"
          className="dep-btn dep-btn--quiet"
          onClick={() => setRevision((value) => value + 1)}
        >
          Refresh
        </button>
      </div>

      <div className="dep-tabs" role="tablist" aria-label="Output format">
        {ALL_FORMATS.map((candidate) => {
          const supported = available.includes(candidate);
          return (
            <button
              key={candidate}
              type="button"
              role="tab"
              className="dep-tab"
              aria-selected={format === candidate}
              disabled={!supported}
              title={
                supported
                  ? `Show ${OUTPUT_LABELS[candidate]} output`
                  : `${editorName} does not produce ${OUTPUT_LABELS[candidate]}`
              }
              onClick={() => setFormat(candidate)}
            >
              {OUTPUT_LABELS[candidate]}
              {!supported && <span aria-hidden="true"> &mdash;</span>}
            </button>
          );
        })}
      </div>

      <pre className="dep-code" data-testid="editor-output">
        {output === null
          ? `${editorName} does not expose ${OUTPUT_LABELS[format]} output.`
          : output || "(empty document)"}
      </pre>
    </section>
  );
}
