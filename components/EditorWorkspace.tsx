import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import NavBar from "./NavBar";

interface EditorWorkspaceProps {
  title: string;
  description: string;
  toolDescription?: string;
  toolRepoUrl?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  statusPanel?: React.ReactNode;
  sidePanel?: React.ReactNode;
}

export default function EditorWorkspace({
  title,
  description,
  toolDescription,
  toolRepoUrl,
  controls,
  children,
  statusPanel,
  sidePanel,
}: EditorWorkspaceProps) {
  return (
    <div className="workspace-shell min-h-screen">
      <header className="workspace-top-bar border-b px-4 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4">
          <div>
            <p className="workspace-brand">Document Editor Playground</p>
            <p className="workspace-brand-subtitle">
              Compare open-source editors in one consistent workspace.
            </p>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <div className="border-b px-4 py-3 sm:px-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <NavBar />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-4 py-4 sm:px-8 sm:py-6">
        <section className="workspace-panel">
          <div className="workspace-panel-header">
            <h1 className="workspace-title">{title}</h1>
            <p className="workspace-description">{description}</p>
            {(toolDescription || toolRepoUrl) && (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {toolDescription}
                {toolDescription && toolRepoUrl ? " " : ""}
                {toolRepoUrl && (
                  <>
                    Repository:{" "}
                    <a
                      href={toolRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-sky-700 underline dark:text-sky-300"
                    >
                      {toolRepoUrl}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
          {controls && (
            <div className="workspace-controls" data-testid="workspace-controls">
              {controls}
            </div>
          )}
          <div className="workspace-editor" data-testid="workspace-editor">
            {children}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="workspace-panel min-h-[7rem]">{statusPanel}</div>
          <aside className="workspace-panel min-h-[7rem]">{sidePanel}</aside>
        </section>
      </main>
    </div>
  );
}
