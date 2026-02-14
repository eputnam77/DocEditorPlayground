import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CodexPage from "../../pages/codex";

describe("CodexPage", () => {
  it("renders Editor.js and handles input", async () => {
    render(<CodexPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Editor.js" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
    const editor = screen.getByTestId("codex-editor");
    await act(async () => {
      editor.innerText = "Hello";
      fireEvent.input(editor);
    });
    expect(editor.getAttribute("contenteditable")).toBe("true");
  });
});
