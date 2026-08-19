import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TiptapPage from "../../pages/tiptap";

describe("TiptapPage", () => {
  it("renders heading", () => {
    render(<TiptapPage />);
    expect(screen.getByRole("heading", { level: 1, name: "TipTap" })).toBeTruthy();
    // Nothing is persisted anywhere, so there is no Save affordance to offer.
    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
    expect(screen.getByRole("combobox", { name: "Templates" })).toBeTruthy();
  });
});
