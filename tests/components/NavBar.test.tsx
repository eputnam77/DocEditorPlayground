import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const prefetchMock = vi.fn();

(globalThis as any).React = React;

vi.mock("next/link", () => ({
  default: ({ href, children, onMouseEnter, ...rest }: any) => (
    <a href={href as string} onMouseEnter={onMouseEnter} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/tiptap",
    prefetch: prefetchMock,
  }),
}));

import NavBar from "../../components/NavBar";

describe("NavBar", () => {
  afterEach(() => {
    prefetchMock.mockClear();
  });

  it("renders and highlights the active editor link", () => {
    render(<NavBar />);
    const active = screen.getByRole("link", { name: "TipTap" });
    expect(active.className).toMatch(/bg-gradient/);
  });

  it("prefetches routes when hovering inactive links", () => {
    render(<NavBar />);
    const toastLink = screen.getByText("Toast Editor");
    fireEvent.mouseEnter(toastLink);
    expect(prefetchMock).toHaveBeenCalledWith("/toast");
  });

  it("includes group class so hover sheen activates", () => {
    render(<NavBar />);
    const link = screen.getByRole("link", { name: "TipTap" });
    expect(link.className.split(" ")).toContain("group");
  });
});
