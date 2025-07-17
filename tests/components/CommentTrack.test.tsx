import { describe, it, expect, vi } from "vitest";
import CommentTrack from "../../components/CommentTrack";
import { render, screen, fireEvent } from "@testing-library/react";

describe("CommentTrack", () => {
  it("adds comments", () => {
    render(<CommentTrack />);
    const input = screen.getByPlaceholderText(/enter comment/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
