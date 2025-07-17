import React, { useState } from "react";

export interface TrackChangesProps {
  /** Current content of the editor */
  content: string;
}

/**
 * TrackChanges displays a lightweight summary of how many characters have been
 * added or removed compared to the original content when the component first
 * mounts. This is a minimal placeholder for a full track‑changes UI.
 */
export default function TrackChanges({ content }: TrackChangesProps) {
  // Capture the initial content on first render
  const [initial] = useState(content);
  const added = Math.max(0, content.length - initial.length);
  const removed = Math.max(0, initial.length - content.length);

  if (added === 0 && removed === 0) return null;

  return (
    <div className="text-xs text-zinc-600 dark:text-zinc-300" data-testid="track-changes">
      {added > 0 && <span data-testid="added">{added} chars added</span>}
      {removed > 0 && (
        <span data-testid="removed" className="ml-2">{removed} chars removed</span>
      )}
    </div>
  );
}
