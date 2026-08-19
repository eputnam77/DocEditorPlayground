import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import NavBar from "./NavBar";
import { EDITOR_BY_ID, EDITOR_CATALOG } from "./editorCatalog";

interface EditorWorkspaceProps {
  /** Catalog id, used for the nav position and the editor profile panel. */
  editorId?: string;
  title: string;
  description: string;
  toolDescription?: string;
  toolRepoUrl?: string;
  controls?: React.ReactNode;
  /**
   * Diagnostics output. Rendered directly beneath the controls rather than at
   * the bottom of the page - previously "Run diagnostics" wrote its results
   * into a panel below the fold, so the button looked like it did nothing.
   */
  diagnostics?: React.ReactNode;
  /** A short note about the editing surface, shown above the editor. */
  surfaceNote?: React.ReactNode;
  children: React.ReactNode;
  statusPanel?: React.ReactNode;
  sidePanel?: React.ReactNode;
}

export function WorkspaceChrome({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <>
      <header className="dep-topbar">
        <div className="dep-wrap flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="dep-brand">
              <strong>Document Editor Playground</strong>
              <span className="dep-brand-mark"> ✎</span>
            </p>
            <p className="dep-muted mt-0.5">
              {subtitle ?? "Six open-source editors, one workspace, side by side."}
            </p>
          </div>
          <DarkModeToggle />
        </div>
        <div className="dep-wrap pb-2">
          <NavBar />
        </div>
      </header>
      {children}
    </>
  );
}

export default function EditorWorkspace({
  editorId,
  title,
  description,
  toolDescription,
  toolRepoUrl,
  controls,
  diagnostics,
  surfaceNote,
  children,
  statusPanel,
  sidePanel,
}: EditorWorkspaceProps) {
  const editor = editorId ? EDITOR_BY_ID[editorId] : undefined;
  const position = editor
    ? EDITOR_CATALOG.findIndex((item) => item.id === editor.id) + 1
    : 0;

  return (
    <div className="dep-shell workspace-shell">
      <WorkspaceChrome subtitle={editor?.tagline}>
        <main className="dep-wrap flex flex-1 flex-col gap-4 py-5">
          <section className="dep-card">
            <div className="workspace-panel-header mb-3">
              <div className="flex flex-wrap items-baseline gap-3">
                {position > 0 && (
                  <span className="dep-num">
                    {String(position).padStart(2, "0")} / {EDITOR_CATALOG.length}
                  </span>
                )}
                <h1 className="dep-title workspace-title">{title}</h1>
                {editor && (
                  <span className="dep-tag dep-tag--mark">{editor.nativeFormat}</span>
                )}
              </div>
              <p className="dep-lede workspace-description mt-1">{description}</p>
              {(toolDescription || toolRepoUrl) && (
                <p className="dep-muted mt-2">
                  {toolDescription}
                  {toolDescription && toolRepoUrl ? " " : ""}
                  {toolRepoUrl && (
                    <a
                      href={toolRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="dep-link"
                    >
                      Source on GitHub
                    </a>
                  )}
                </p>
              )}
            </div>

            {controls && (
              <div
                className="workspace-controls flex flex-wrap items-center gap-2"
                data-testid="workspace-controls"
              >
                {controls}
              </div>
            )}

            {diagnostics && <div className="mt-3">{diagnostics}</div>}

            {surfaceNote && <div className="dep-callout mt-3">{surfaceNote}</div>}

            <div className="workspace-editor mt-3" data-testid="workspace-editor">
              {children}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="dep-card workspace-panel min-h-[7rem]">{statusPanel}</div>
            <aside className="dep-card workspace-panel min-h-[7rem]">{sidePanel}</aside>
          </section>
        </main>
      </WorkspaceChrome>
    </div>
  );
}
