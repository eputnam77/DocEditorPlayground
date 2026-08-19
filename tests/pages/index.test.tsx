import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "../../pages";

describe("HomePage", () => {
  it("links to editor pages", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("link", { name: /TipTap/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Open →").length).toBeGreaterThan(1);
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
  });
});
