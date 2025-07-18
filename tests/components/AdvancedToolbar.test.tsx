import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdvancedToolbar, {
  ToolbarAction,
} from "../../components/AdvancedToolbar";

describe("AdvancedToolbar", () => {
  it("calls action handler when button clicked", () => {
    const handle = vi.fn();
    const actions: ToolbarAction[] = [{ label: "Bold", onClick: handle }];
    render(<AdvancedToolbar actions={actions} />);
    const btn = screen.getByLabelText("Bold");
    fireEvent.click(btn);
    expect(handle).toHaveBeenCalled();
  });
});
