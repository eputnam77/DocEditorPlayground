import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CodexPage from "../../pages/codex";

describe("CodexPage", () => {
  it("renders Editor.js and handles input", async () => {
    render(<CodexPage />);
    expect(screen.getByText("Editor.js")).toBeTruthy();
    const editor = screen.getByTestId("codex-editor");
    await act(async () => {
      editor.innerText = "Hello";
      fireEvent.input(editor);
    });
    expect(screen.getByTestId("track-changes")).toBeTruthy();
  });
});
