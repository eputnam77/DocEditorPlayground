import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SlatePage from "../../pages/slate";

describe("SlatePage", () => {
  it("renders heading", () => {
    render(<SlatePage />);
    expect(screen.getByText("Slate")).toBeTruthy();
    expect(screen.getByLabelText("Add Comment")).toBeTruthy();
  });

  it("accepts user input", () => {
    render(<SlatePage />);
    const editor = screen.getByTestId("slate-editor");
    editor.textContent = "Hello";
    fireEvent.input(editor);
    expect(editor.textContent).toBe("Hello");
  });
});
