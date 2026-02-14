import React, { useState } from "react";

const INVISIBLE_COMMENT_CHARS = /[\u200B-\u200D\u2060-\u206F\uFEFF]/g;

/**
 * CommentTrack is a tiny demonstration component that allows users to add
 * comments to a list. It purposely avoids persistence and rich features so the
 * surrounding editor pages remain lightweight.
 */
export default function CommentTrack() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  function add() {
    const cleaned = comment.replace(INVISIBLE_COMMENT_CHARS, "");
    const trimmed = cleaned.trim();
    if (!trimmed) return;
    // Use functional updates to avoid stale state when called rapidly
    setComments((prev: string[]) => [...prev, trimmed]);
    setComment("");
  }

  return (
    <section className="space-y-2" data-testid="comment-track">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-100" htmlFor="comment-input">
        Comments
      </label>
      <div className="flex items-center gap-2">
        <input
          id="comment-input"
          className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment for this draft"
        />
        <button
          className="rounded-md bg-sky-600 px-3 py-1 text-sm font-semibold text-white hover:bg-sky-700"
          onClick={add}
        >
          Add comment
        </button>
      </div>
      {comments.length > 0 && (
        <ul
          className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-200"
          data-testid="comment-list"
        >
          {comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
