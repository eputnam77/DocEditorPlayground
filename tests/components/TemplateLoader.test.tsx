import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TemplateLoader from "../../components/TemplateLoader";

describe("TemplateLoader", () => {
  it("calls onLoad with selected template and shows validation", () => {
    const handler = vi.fn();
    render(<TemplateLoader onLoad={handler} />);
    fireEvent.click(screen.getByTestId("template-load-btn"));
    expect(handler).toHaveBeenCalled();
    expect(screen.getByTestId("template-msg").textContent).toMatch(/Template/);
  });

  it("handles errors from onLoad gracefully", () => {
    const handler = vi.fn(() => {
      throw new Error("fail");
    });
    render(<TemplateLoader onLoad={handler} />);
    fireEvent.click(screen.getByTestId("template-load-btn"));
    expect(screen.getByTestId("template-msg").textContent).toContain("Failed");
  });

  it("lists the newly added templates", () => {
    render(<TemplateLoader onLoad={() => {}} />);
    expect(screen.getByText("faaAdvisoryCircular")).toBeInTheDocument();
    expect(screen.getByText("releaseNotes")).toBeInTheDocument();
  });
});
