import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentTrack from "../../components/CommentTrack";

describe("CommentTrack", () => {
  it("adds comments", () => {
    render(<CommentTrack />);
    const input = screen.getByPlaceholderText(/enter comment/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("hello").textContent).toBe("hello");
  });
});
