import { describe, it, expect } from "vitest";
import ValidationStatus from "../../components/ValidationStatus";
import { render, screen } from "@testing-library/react";

describe("ValidationStatus", () => {
  it("renders results", () => {
    render(
      <ValidationStatus
        results={[{ id: 1, label: "A", passed: true }]}
        onClear={() => {}}
      />,
    );
    expect(screen.getByText(/A/)).toBeInTheDocument();
  });
});
