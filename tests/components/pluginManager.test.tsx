import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PluginManager from "../../components/PluginManager";

describe("PluginManager", () => {
  it("toggles plugin state", () => {
    const handler = vi.fn();
    render(<PluginManager plugins={["a"]} onToggle={handler} />);
    const checkbox = screen.getByTestId("plugin-a");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handler).toHaveBeenCalledWith("a", true);
  });
});
