import React, { useState } from "react";

let graphemeSegmenter: Intl.Segmenter | null | undefined;

function countGraphemes(text: string): number {
  if (text.length === 0) {
    return 0;
  }
  if (graphemeSegmenter === undefined) {
    graphemeSegmenter =
      typeof Intl !== "undefined" &&
      typeof (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter ===
        "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (graphemeSegmenter) {
    let count = 0;
    for (const _ of graphemeSegmenter.segment(text)) {
      count++;
    }
    return count;
  }
  return Array.from(text).length;
}

export interface TrackChangesProps {
  content: string;
}

export default function TrackChanges({ content }: TrackChangesProps) {
  const initialLen = useState<number>(() => countGraphemes(content))[0];
  const currentLen = countGraphemes(content);
  const added = Math.max(0, currentLen - initialLen);
  const removed = Math.max(0, initialLen - currentLen);

  if (added === 0 && removed === 0) return null;

  return (
    <div className="dep-mono" data-testid="track-changes" style={{ color: "var(--ink-60)" }}>
      {added > 0 && <span data-testid="added">{added} characters added</span>}
      {removed > 0 && (
        <span data-testid="removed" className="ml-3">
          {removed} characters removed
        </span>
      )}
    </div>
  );
}
