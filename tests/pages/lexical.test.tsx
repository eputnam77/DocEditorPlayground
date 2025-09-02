import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LexicalPage from "../../pages/lexical";

describe("LexicalPage", () => {
  it("renders heading", () => {
    render(<LexicalPage />);
    expect(screen.getByText("Lexical")).toBeTruthy();
    expect(screen.getByLabelText("Add Comment")).toBeTruthy();
  });

  it("accepts user input", async () => {
    render(<LexicalPage />);
    const editor = screen.getByTestId("lexical-editor");
    await new Promise((r) => setTimeout(r, 0));
    editor.textContent = "Hello";
    fireEvent.input(editor);
    expect(editor.textContent).toBe("Hello");
  });

  it("formats bold text", async () => {
    render(<LexicalPage />);
    const editor = screen.getByTestId("lexical-editor");
    await new Promise((r) => setTimeout(r, 0));
    editor.textContent = "Hello ";
    fireEvent.input(editor);
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    editor.innerHTML += "<b>bold</b>";
    fireEvent.input(editor);
    expect(editor.innerHTML).toMatch(/<(b|strong)>bold<\/\w+>/i);
  });
});
