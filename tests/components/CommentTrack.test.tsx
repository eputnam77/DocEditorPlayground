import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CommentTrack from "../../components/CommentTrack";

describe("CommentTrack", () => {
  it("adds comments", () => {
    render(<CommentTrack />);
    const input = screen.getByPlaceholderText(/enter comment/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("hello").textContent).toBe("hello");
  });

  it("handles rapid sequential additions", () => {
    render(<CommentTrack />);
    const input = screen.getByPlaceholderText(/enter comment/i) as HTMLInputElement;
    const button = screen.getByText("Add");
    act(() => {
      fireEvent.change(input, { target: { value: "one" } });
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      fireEvent.change(input, { target: { value: "two" } });
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toEqual(["one", "two"]);
  });

  it("avoids losing comments on concurrent adds", () => {
    render(<CommentTrack />);
    const input = screen.getByPlaceholderText(/enter comment/i) as HTMLInputElement;
    const button = screen.getByText("Add");
    fireEvent.change(input, { target: { value: "hi" } });
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });
});
