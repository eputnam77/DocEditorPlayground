import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SimpleEditor from "../../components/SimpleEditor";

describe("SimpleEditor", () => {
  it("toggles bold and italic styles", () => {
    render(<SimpleEditor />);
    const editor = screen.getByTestId("simple-editor");
    expect(editor).toHaveStyle("font-weight: normal");
    fireEvent.click(screen.getByTestId("btn-bold"));
    expect(editor).toHaveStyle("font-weight: bold");
    fireEvent.click(screen.getByTestId("btn-italic"));
    expect(editor).toHaveStyle("font-style: italic");
  });

  it("adds comments to the list", () => {
    render(<SimpleEditor />);
    window.prompt = () => "My comment";
    fireEvent.click(screen.getByTestId("btn-comment"));
    expect(screen.getByTestId("comment-list")).toHaveTextContent("My comment");
  });
});
