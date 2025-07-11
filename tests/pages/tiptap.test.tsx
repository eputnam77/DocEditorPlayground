import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TiptapPage from "../../pages/tiptap";

describe("TiptapPage", () => {
  it("renders plugin manager and editor", () => {
    render(<TiptapPage />);
    expect(screen.getByTestId("plugin-bold")).toBeInTheDocument();
    expect(screen.getByTestId("simple-editor")).toBeInTheDocument();
  });
});
