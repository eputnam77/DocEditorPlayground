import React from "react";
import { describe, it, expect, vi } from "vitest";
import HeadingStylePresets from "../../components/HeadingStylePresets";
import { render, screen, fireEvent } from "@testing-library/react";

describe.skip("HeadingStylePresets", () => {
  it("invokes callback", () => {
    const cb = vi.fn();
    render(<HeadingStylePresets onSelect={cb} />);
    fireEvent.click(screen.getByLabelText("Heading 1"));
    expect(cb).toHaveBeenCalledWith(1);
  });
});
