import React from 'react';

interface Props {
  editorName: string;
}

/**
 * Displays a short message linking to the integration guides.
 * This component is intentionally simple to keep pages lightweight.
 */
export default function EditorIntegrationInfo({ editorName }: Props) {
  return (
    <section className="mt-4 text-sm text-zinc-700 dark:text-zinc-200">
      <p>
        For instructions on integrating {editorName}, see{' '}
        <a
          href="https://github.com/eputnam77/DocEditorPlayground/blob/main/docs/integration-guides.md"
          className="text-indigo-600 underline"
        >
          the integration guide
        </a>
        .
      </p>
    </section>
  );
}
