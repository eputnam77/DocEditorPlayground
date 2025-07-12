import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import QuillPage from "../../pages/quill";

describe("QuillPage", () => {
  it("renders heading", () => {
    render(<QuillPage />);
    expect(screen.getByText("Quill Editor")).toBeInTheDocument();
  });
});
