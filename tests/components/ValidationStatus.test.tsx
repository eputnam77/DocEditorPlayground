import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ValidationStatus from "../../components/ValidationStatus";

describe("ValidationStatus", () => {
  it("renders results", () => {
    render(
      <ValidationStatus
        results={[{ id: 1, label: "A", passed: true }]}
        onClear={() => {}}
      />,
    );
    expect(screen.getByText(/A:/).textContent).toContain("A:");
  });
});
