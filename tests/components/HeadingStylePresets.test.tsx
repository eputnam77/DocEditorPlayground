import { describe, it, expect } from "vitest";
import HeadingStylePresets from "../../components/HeadingStylePresets";
import { render, screen, fireEvent } from "@testing-library/react";

describe("HeadingStylePresets", () => {
  it("invokes callback", () => {
    const cb = vi.fn();
    render(<HeadingStylePresets onSelect={cb} />);
    fireEvent.click(screen.getByLabelText("Heading 1"));
    expect(cb).toHaveBeenCalledWith(1);
  });
});
