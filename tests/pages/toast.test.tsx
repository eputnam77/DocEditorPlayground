import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToastPage from "../../pages/toast";

describe("ToastPage", () => {
  it("renders heading", () => {
    render(<ToastPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Toast UI Editor" })).toBeTruthy();
    expect(screen.getByText("Comments")).toBeTruthy();
  });

  it("renders an LTR editor host and diagnostics controls", () => {
    const { container } = render(<ToastPage />);
    const shell = container.querySelector(".toast-editor-shell");
    expect(shell?.getAttribute("dir")).toBe("ltr");
    expect(screen.getByRole("button", { name: "Run diagnostics" })).toBeTruthy();
  });
});
