import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TiptapPage from "../../pages/tiptap";

describe("TiptapPage", () => {
  it("renders heading", () => {
    render(<TiptapPage />);
    expect(screen.getByText("TipTap Editor")).toBeTruthy();
  });
});
