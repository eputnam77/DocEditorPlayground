import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DarkModeToggle from "../../components/DarkModeToggle";

describe("DarkModeToggle", () => {
  it("toggles dark class on document element", () => {
    render(<DarkModeToggle />);
    const btn = screen.getByTestId("dark-mode-toggle");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
