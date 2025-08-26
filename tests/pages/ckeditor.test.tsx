import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CkeditorPage from "../../pages/ckeditor";

describe("CkeditorPage", () => {
  it("renders heading", () => {
    render(<CkeditorPage />);
    expect(screen.getByText("CKEditor 5")).toBeTruthy();
    expect(screen.getByLabelText("Add Comment")).toBeTruthy();
  });
});
