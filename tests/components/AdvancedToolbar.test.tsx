import { describe, it, expect, vi } from "vitest";
import AdvancedToolbar from "../../components/AdvancedToolbar";
import { render, screen, fireEvent } from "@testing-library/react";

describe("AdvancedToolbar", () => {
  it("calls actions", () => {
    const handler = vi.fn();
    render(<AdvancedToolbar actions={[{ label: "Bold", onClick: handler }]} />);
    fireEvent.click(screen.getByLabelText("Bold"));
    expect(handler).toHaveBeenCalled();
  });
});
