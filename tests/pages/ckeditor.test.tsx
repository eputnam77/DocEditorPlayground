import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CkeditorPage from "../../pages/ckeditor";

describe("CkeditorPage", () => {
  it("renders heading", () => {
    render(<CkeditorPage />);
    expect(screen.getByRole("heading", { level: 1, name: "CKEditor 5" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("renders an LTR editor host and diagnostics controls", () => {
    const { container } = render(<CkeditorPage />);
    const shell = container.querySelector(".ckeditor-editor-shell");
    expect(shell?.getAttribute("dir")).toBe("ltr");
    expect(screen.getByRole("button", { name: "Run diagnostics" })).toBeTruthy();
  });
});
