import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LexicalPage from "../../pages/lexical";

describe("LexicalPage", () => {
  it("renders heading", () => {
    render(<LexicalPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Lexical" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("renders editable surface", async () => {
    render(<LexicalPage />);
    const editor = screen.getByTestId("lexical-editor");
    expect(editor).toBeTruthy();
    await new Promise((r) => setTimeout(r, 0));
  });
});
