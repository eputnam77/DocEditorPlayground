import React from "react";
import { EDITOR_BY_ID, OUTPUT_LABELS, type EditorCatalogItem } from "./editorCatalog";

/**
 * The "why this editor is not like the others" panel.
 *
 * Every editor page renders the same six editors' worth of shared chrome, which
 * made them look interchangeable. This panel states, per editor, what its data
 * model is, where its formatting controls come from, what it can serialize, and
 * what it uniquely does - so switching pages shows a difference, not a reskin.
 */
export default function EditorProfile({ editorId }: { editorId: string }) {
  const editor: EditorCatalogItem | undefined = EDITOR_BY_ID[editorId];

  if (!editor) {
    return null;
  }

  return (
    <section className="space-y-4" data-testid="editor-profile">
      <div>
        <h2 className="dep-eyebrow">What makes {editor.name} different</h2>
        <p className="dep-subtitle mt-1">{editor.tagline}</p>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="border-t pt-2" style={{ borderColor: "var(--ink-08)" }}>
          <dt className="dep-eyebrow">Data model</dt>
          <dd className="mt-0.5" style={{ color: "var(--ink-80)" }}>
            {editor.dataModel}
          </dd>
        </div>
        <div className="border-t pt-2" style={{ borderColor: "var(--ink-08)" }}>
          <dt className="dep-eyebrow">Source of truth</dt>
          <dd className="mt-0.5" style={{ color: "var(--ink-80)" }}>
            {editor.nativeFormat}
          </dd>
        </div>
        <div className="border-t pt-2" style={{ borderColor: "var(--ink-08)" }}>
          <dt className="dep-eyebrow">Reads out as</dt>
          <dd className="mt-1">
            <span className="dep-tags">
              {editor.outputs.map((output) => (
                <span key={output} className="dep-tag">
                  {OUTPUT_LABELS[output]}
                </span>
              ))}
            </span>
          </dd>
        </div>
        <div className="border-t pt-2" style={{ borderColor: "var(--ink-08)" }}>
          <dt className="dep-eyebrow">Toolbar</dt>
          <dd className="mt-0.5" style={{ color: "var(--ink-80)" }}>
            {editor.toolbarStyle}
          </dd>
        </div>
      </dl>

      <div>
        <h3 className="dep-eyebrow mb-1.5">Only here</h3>
        <ul className="space-y-1.5 text-sm" style={{ color: "var(--ink-80)" }}>
          {editor.distinctive.map((item) => (
            <li key={item} className="dep-changebar">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="dep-callout">
        <strong>Trade-off.</strong> {editor.tradeoff}
      </p>

      <p className="dep-muted">
        {editor.toolDescription}{" "}
        <a
          href={editor.githubRepoUrl}
          target="_blank"
          rel="noreferrer"
          className="dep-link"
        >
          Source on GitHub
        </a>
      </p>
    </section>
  );
}
