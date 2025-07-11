import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EditorIntegrationInfo from "../../components/EditorIntegrationInfo";

describe("EditorIntegrationInfo", () => {
  it("shows instructions for a given editor", () => {
    render(<EditorIntegrationInfo editorName="tiptap" />);
    expect(screen.getByTestId("integration-info").textContent).toMatch(
      /tiptap/i,
    );
  });
});
