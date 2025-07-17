import { describe, it, expect } from "vitest";
import ModernLayout from "../../components/ModernLayout";
import { render, screen } from "@testing-library/react";

describe("ModernLayout", () => {
  it("renders children", () => {
    render(
      <ModernLayout>
        <span>child</span>
      </ModernLayout>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
