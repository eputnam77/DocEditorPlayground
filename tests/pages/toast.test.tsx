import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToastPage from "../../pages/toast";

describe("ToastPage", () => {
  it("renders plugin manager and editor", () => {
    render(<ToastPage />);
    expect(screen.getByTestId("plugin-chart")).toBeInTheDocument();
    expect(screen.getByTestId("simple-editor")).toBeInTheDocument();
  });
});
