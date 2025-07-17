import React, { useState } from "react";

/** Simple comment list with an input box to demonstrate comment tracking. */
export default function CommentTrack() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  function add() {
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment("");
    }
  }

  return (
    <div className="mt-4">
      <label className="text-sm block mb-1" htmlFor="comment-input">
        Add Comment
      </label>
      <div className="flex items-center gap-2">
        <input
          id="comment-input"
          className="border px-2 py-1 rounded flex-1"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter comment"
        />
        <button className="px-2 py-1 bg-indigo-600 text-white rounded" onClick={add}>
          Add
        </button>
      </div>
      {comments.length > 0 && (
        <ul className="mt-2 text-sm list-disc list-inside" data-testid="comment-list">
          {comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
