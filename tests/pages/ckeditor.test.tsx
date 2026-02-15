import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CkeditorPage from "../../pages/ckeditor";

describe("CkeditorPage", () => {
  it("renders heading", () => {
    render(<CkeditorPage />);
    expect(screen.getByRole("heading", { level: 1, name: "CKEditor 5" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("renders editor and accepts input", () => {
    const { container } = render(<CkeditorPage />);
    const shell = container.querySelector(".ckeditor-editor-shell");
    expect(shell?.getAttribute("dir")).toBe("ltr");
    const editable = screen.getByRole("textbox", { name: "" });
    fireEvent.input(editable, {
      target: { innerHTML: "Hello" },
    });
    expect(editable.innerHTML).toContain("Hello");
  });
});
