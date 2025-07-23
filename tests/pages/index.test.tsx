import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "../../pages";

describe.skip("HomePage", () => {
  it("links to editor pages", () => {
    render(<HomePage />);
    expect(screen.getByText("tiptap")).toBeInTheDocument();
  });
});
