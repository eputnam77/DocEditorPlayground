import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToastPage from "../../pages/toast";

describe("ToastPage", () => {
  it("renders heading", () => {
    render(<ToastPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Toast UI Editor" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("accepts input", () => {
    const { container } = render(<ToastPage />);
    const shell = container.querySelector(".toast-editor-shell");
    expect(shell?.getAttribute("dir")).toBe("ltr");
    const editor = screen.getByTestId("toast-editor");
    fireEvent.input(editor, { target: { innerHTML: "Hello" } });
    expect(editor.innerHTML).toContain("Hello");
  });
});
