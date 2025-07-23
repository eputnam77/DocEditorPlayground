import React from "react";
import { describe, it, expect, vi } from "vitest";
import ModernLayout from "../../components/ModernLayout";
import { render, screen } from "@testing-library/react";

describe.skip("ModernLayout", () => {
  it("renders children", () => {
    render(
      <ModernLayout>
        <span>child</span>
      </ModernLayout>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
