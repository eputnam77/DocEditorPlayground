import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CodexPage from "../../pages/codex";

describe("CodexPage", () => {
  it("renders heading", () => {
    render(<CodexPage />);
    expect(screen.getByText("Editor.js")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Comment")).toBeInTheDocument();
  });
});
