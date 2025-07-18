import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TrackChanges from "../../components/TrackChanges";

describe("TrackChanges", () => {
  it("reports added characters", () => {
    const { rerender } = render(<TrackChanges content="" />);
    rerender(<TrackChanges content="abc" />);
    expect(screen.getByTestId("added").textContent).toContain("3");
  });

  it("reports removed characters", () => {
    const { rerender } = render(<TrackChanges content="abcdef" />);
    rerender(<TrackChanges content="abc" />);
    expect(screen.getByTestId("removed").textContent).toContain("3");
  });
});
