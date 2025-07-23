import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToastPage from "../../pages/toast";

describe.skip("ToastPage", () => {
  it("renders heading", () => {
    render(<ToastPage />);
    expect(screen.getByText("Toast UI Editor")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Comment")).toBeInTheDocument();
  });
});
