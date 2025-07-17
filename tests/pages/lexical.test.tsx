import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LexicalPage from "../../pages/lexical";

describe("LexicalPage", () => {
  it("renders heading", () => {
    render(<LexicalPage />);
    expect(screen.getByText("Lexical")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Comment")).toBeInTheDocument();
  });
});
