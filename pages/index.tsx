import React from "react";
import Link from "next/link";
import Head from "next/head";
import DarkModeToggle from "../components/DarkModeToggle";
import NavBar from "../components/NavBar";
import { EDITOR_CATALOG, OUTPUT_LABELS } from "../components/editorCatalog";

export default function HomePage() {
  return (
    <div className="dep-shell">
      <Head>
        <title>Document Editor Playground</title>
      </Head>

      <header className="dep-topbar">
        <div className="dep-wrap flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="dep-brand">
            <strong>Document Editor Playground</strong>
            <span className="dep-brand-mark"> ✎</span>
          </p>
          <DarkModeToggle />
        </div>
        <div className="dep-wrap pb-2">
          <NavBar />
        </div>
      </header>

      <main className="dep-wrap flex-1 py-10">
        {/* ---- Lede ------------------------------------------------------- */}
        <section className="max-w-3xl">
          <p className="dep-eyebrow">Six editors, one workspace</p>
          <h1 className="dep-display mt-2">
            The same document,
            <br />
            six different editors.
          </h1>
          <p className="dep-lede mt-4">
            Every editor below gets the same shell, the same sample documents, and the
            same diagnostics, so the only thing that varies is the editor itself. Type
            in each one, load a template, then open the output panel to see what that
            editor actually hands you: HTML, Markdown, or a JSON node tree.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={EDITOR_CATALOG[0].path} className="dep-btn dep-btn--mark">
              Start with {EDITOR_CATALOG[0].name} →
            </Link>
            <a
              href="https://github.com/eputnam77/DocEditorPlayground"
              target="_blank"
              rel="noreferrer"
              className="dep-btn"
            >
              This project on GitHub
            </a>
          </div>
        </section>

        {/* ---- Comparison table ------------------------------------------ */}
        <section className="mt-14">
          <h2 className="dep-eyebrow">At a glance</h2>
          <p className="dep-muted mt-1 mb-4">
            The differences that actually change how you build with each one.
          </p>
          <div className="overflow-x-auto">
            <table className="dep-compare">
              <thead>
                <tr>
                  <th scope="col">Editor</th>
                  <th scope="col">Editing model</th>
                  <th scope="col">Source of truth</th>
                  <th scope="col">Reads out as</th>
                  <th scope="col">Toolbar</th>
                </tr>
              </thead>
              <tbody>
                {EDITOR_CATALOG.map((editor, index) => (
                  <tr key={editor.id}>
                    <th scope="row">
                      <span className="dep-num mr-2">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Link href={editor.path} className="dep-link font-semibold">
                        {editor.name}
                      </Link>
                    </th>
                    <td>{editor.dataModel}</td>
                    <td>
                      <span className="dep-tag dep-tag--mark">{editor.nativeFormat}</span>
                    </td>
                    <td>
                      <span className="dep-tags">
                        {editor.outputs.map((output) => (
                          <span key={output} className="dep-tag">
                            {OUTPUT_LABELS[output]}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td>{editor.toolbarStyle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---- The index ------------------------------------------------- */}
        <section className="mt-14">
          <h2 className="dep-eyebrow">The editors</h2>
          <ul className="dep-index mt-3">
            {EDITOR_CATALOG.map((editor, index) => (
              <li key={editor.id} className="dep-entry">
                <Link href={editor.path} className="dep-entry__link">
                  <span className="dep-entry__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="dep-entry__body">
                    <span className="dep-entry__name">{editor.name}</span>
                    <span className="dep-entry__what">{editor.summary}</span>
                    <span className="dep-entry__only">
                      <strong>Only here:</strong> {editor.distinctive[0]}
                    </span>
                  </span>
                  <span className="dep-entry__go" aria-hidden="true">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- How to compare -------------------------------------------- */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="dep-subtitle">1. Type in it</h3>
            <p className="dep-muted mt-1">
              Each editor opens with the same Lorem Ipsum draft already loaded, so you
              can select text and try bold, italic, headings, and lists immediately.
              Every toolbar button names itself on hover.
            </p>
          </div>
          <div>
            <h3 className="dep-subtitle">2. Load the same template</h3>
            <p className="dep-muted mt-1">
              The three sample documents - release notes, a research article, a contract
              - are identical across all six editors. Watch which structure survives the
              import and which gets flattened.
            </p>
          </div>
          <div>
            <h3 className="dep-subtitle">3. Read the output</h3>
            <p className="dep-muted mt-1">
              The output panel on each page shows the live document as HTML, JSON, and
              Markdown. A grayed-out tab means that editor cannot produce that format at
              all - which is often the deciding factor.
            </p>
          </div>
        </section>

        <footer className="dep-foot mt-16">
          <p className="dep-muted">
            Document Editor Playground · a neutral bench for comparing open-source
            editors. Nothing you type here is saved or sent anywhere.
          </p>
        </footer>
      </main>
    </div>
  );
}
