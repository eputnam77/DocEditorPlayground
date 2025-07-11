import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PluginManager from "../../components/PluginManager";

describe("PluginManager", () => {
  it("toggles plugin state", () => {
    render(<PluginManager plugins={["a"]} />);
    const checkbox = screen.getByTestId("plugin-a");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
