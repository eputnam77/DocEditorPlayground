import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CkeditorPage from "../../pages/ckeditor";

describe("CkeditorPage", () => {
  it("renders heading", () => {
    render(<CkeditorPage />);
    expect(screen.getByText("CKEditor 5")).toBeTruthy();
    expect(screen.getByLabelText("Add Comment")).toBeTruthy();
  });

  it("renders editor and accepts input", () => {
    render(<CkeditorPage />);
    const editable = screen.getByRole("textbox", { name: "" });
    fireEvent.input(editable, {
      target: { innerHTML: "Hello" },
    });
    expect(editable.innerHTML).toContain("Hello");
  });
});
