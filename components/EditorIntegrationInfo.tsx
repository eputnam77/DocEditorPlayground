import React from "react";
import { EDITOR_CATALOG } from "./editorCatalog";

interface Props {
  editorName: string;
}

/**
 * Displays a short message linking to the integration guides.
 * This component is intentionally simple to keep pages lightweight.
 */
export default function EditorIntegrationInfo({ editorName }: Props) {
  const metadata = EDITOR_CATALOG.find((item) => item.name === editorName);

  return (
    <section className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
      {metadata && (
        <p>
          {metadata.toolDescription}{" "}
          <a
            href={metadata.githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-sky-700 underline dark:text-sky-300"
          >
            GitHub repository
          </a>
          .
        </p>
      )}
      <p>
        Need integration details for {editorName}? Review{" "}
        <a
          href="https://github.com/eputnam77/DocEditorPlayground/blob/main/docs/integration-guides.md"
          className="font-semibold text-sky-700 underline dark:text-sky-300"
        >
          the integration guide
        </a>
        .
      </p>
    </section>
  );
}
