import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToastPage from "../../pages/toast";

describe("ToastPage", () => {
  it("renders heading", () => {
    render(<ToastPage />);
    expect(screen.getByText("Toast UI Editor")).toBeTruthy();
    expect(screen.getByLabelText("Add Comment")).toBeTruthy();
  });

  it("accepts input", () => {
    render(<ToastPage />);
    const editor = screen.getByTestId("toast-editor");
    fireEvent.input(editor, { target: { innerHTML: "Hello" } });
    expect(editor.innerHTML).toContain("Hello");
  });
});
