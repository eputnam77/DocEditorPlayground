import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SlatePage from "../../pages/slate";

describe.skip("SlatePage", () => {
  it("renders heading", () => {
    render(<SlatePage />);
    expect(screen.getByText("Slate")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Comment")).toBeInTheDocument();
  });
});
