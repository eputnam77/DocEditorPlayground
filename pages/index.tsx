import React from "react";
import Link from "next/link";
import DarkModeToggle from "../components/DarkModeToggle";
import NavBar from "../components/NavBar";
import { EDITOR_CATALOG } from "../components/editorCatalog";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
        <header className="workspace-panel">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="workspace-brand">Document Editor Playground</p>
              <h1 className="workspace-title">Evaluate editors with one consistent workflow</h1>
              <p className="workspace-description">
                Open any editor, test formatting and plugins, then switch to the next editor without changing how you work.
              </p>
            </div>
            <DarkModeToggle />
          </div>
          <NavBar />
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EDITOR_CATALOG.map((editor) => (
            <Link
              key={editor.id}
              href={editor.path}
              className="workspace-panel flex min-h-44 flex-col justify-between transition hover:-translate-y-0.5 hover:border-sky-300"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{editor.name}</h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{editor.summary}</p>
              </div>
              <p className="mt-4 text-sm font-semibold text-sky-700 dark:text-sky-300">Open editor</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
