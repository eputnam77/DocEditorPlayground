import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SlatePage from "../../pages/slate";

describe("SlatePage", () => {
  it("renders heading", () => {
    render(<SlatePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Slate" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("renders editable surface", () => {
    render(<SlatePage />);
    const editor = screen.getByTestId("slate-editor");
    expect(editor.getAttribute("dir")).toBe("ltr");
  });
});
