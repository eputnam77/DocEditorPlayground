import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CodexPage from "../../pages/codex";

describe("CodexPage", () => {
  it("renders Editor.js workspace controls", () => {
    render(<CodexPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Editor.js" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
    expect(screen.getByTestId("codex-editor").getAttribute("dir")).toBe("ltr");
    expect(screen.getByRole("button", { name: "Heading" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bullet list" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Numbered list" })).toBeTruthy();
  });
});
