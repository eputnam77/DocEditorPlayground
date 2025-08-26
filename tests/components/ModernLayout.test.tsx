import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ModernLayout from "../../components/ModernLayout";

describe("ModernLayout", () => {
  it("renders children", () => {
    render(
      <ModernLayout>
        <span>child</span>
      </ModernLayout>,
    );
    expect(screen.getByText("child").textContent).toBe("child");
  });
});
