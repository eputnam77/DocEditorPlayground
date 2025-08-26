import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeadingStylePresets from "../../components/HeadingStylePresets";

describe("HeadingStylePresets", () => {
  it("invokes callback", () => {
    const cb = vi.fn();
    render(<HeadingStylePresets onSelect={cb} />);
    fireEvent.click(screen.getByLabelText("Heading 1"));
    expect(cb).toHaveBeenCalledWith(1);
  });
});
