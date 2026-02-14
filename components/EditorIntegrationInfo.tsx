import React from "react";

interface Props {
  editorName: string;
}

/**
 * Displays a short message linking to the integration guides.
 * This component is intentionally simple to keep pages lightweight.
 */
export default function EditorIntegrationInfo({ editorName }: Props) {
  return (
    <section className="text-sm text-slate-700 dark:text-slate-200">
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
