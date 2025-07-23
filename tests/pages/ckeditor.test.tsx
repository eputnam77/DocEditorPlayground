import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CkeditorPage from "../../pages/ckeditor";

describe.skip("CkeditorPage", () => {
  it("renders heading", () => {
    render(<CkeditorPage />);
    expect(screen.getByText("CKEditor 5")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Comment")).toBeInTheDocument();
  });
});
