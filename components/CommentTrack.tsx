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
      <label className="dep-eyebrow block" htmlFor="comment-input">
        Comments
      </label>
      <div className="flex items-center gap-2">
        <input
          id="comment-input"
          className="dep-input flex-1"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment for this draft"
        />
        <button
          className="dep-btn dep-btn--mark"
          onClick={add}
        >
          Add comment
        </button>
      </div>
      {comments.length > 0 && (
        <ul
          className="dep-doc space-y-1 pl-5 text-sm"
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
