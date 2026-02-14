import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import DarkModeToggle, {
  THEME_STORAGE_KEY,
} from "../../components/DarkModeToggle";

describe("DarkModeToggle", () => {
  beforeEach(() => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.classList.remove("dark");
  });

  it("toggles dark class on document element", () => {
    render(<DarkModeToggle />);
    const btn = screen.getByTestId("dark-mode-toggle");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("initializes from localStorage when preference exists", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(<DarkModeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
