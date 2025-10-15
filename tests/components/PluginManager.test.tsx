import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PluginManager, { PluginItem } from "../../components/PluginManager";

const plugins: PluginItem[] = [{ name: "A" }, { name: "B" }];

describe("PluginManager", () => {
  it("calls onChange when toggling a plugin", () => {
    const handle = vi.fn();
    render(
      <PluginManager plugins={plugins} enabled={["A"]} onChange={handle} />,
    );
    fireEvent.click(screen.getByLabelText("Plugins"));
    const checkbox = screen.getByLabelText("B") as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(handle).toHaveBeenCalledWith(["A", "B"]);
  });

  it("does not toggle locked plugins", () => {
    const handle = vi.fn();
    render(
      <PluginManager
        plugins={plugins}
        enabled={["A"]}
        locked={["B"]}
        onChange={handle}
      />,
    );
    fireEvent.click(screen.getByLabelText("Plugins"));
    const checkbox = screen.getByLabelText("B") as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
    expect(handle).toHaveBeenCalledWith(["A", "B"]);
    handle.mockClear();
    fireEvent.click(checkbox);
    expect(handle).not.toHaveBeenCalled();
  });

  it("forces locked plugins to remain enabled", () => {
    const handle = vi.fn();
    render(
      <PluginManager
        plugins={plugins}
        enabled={[]}
        locked={["A"]}
        onChange={handle}
      />,
    );

    fireEvent.click(screen.getByLabelText("Plugins"));
    const lockedCheckbox = screen.getByLabelText("A") as HTMLInputElement;
    expect(lockedCheckbox.checked).toBe(true);

    // Allow pending effect callbacks to flush
    expect(handle).toHaveBeenCalledWith(["A"]);
    handle.mockClear();

    const otherCheckbox = screen.getByLabelText("B") as HTMLInputElement;
    fireEvent.click(otherCheckbox);
    expect(handle).toHaveBeenCalledWith(["A", "B"]);
  });
});
