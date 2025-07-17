import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TemplateLoader, { TemplateMeta } from "../../components/TemplateLoader";

const templates: TemplateMeta[] = [{ label: "One", filename: "one.html" }];

describe("TemplateLoader", () => {
  it("invokes callbacks on selection and clear", async () => {
    const load = vi.fn();
    const clear = vi.fn();
    render(
      <TemplateLoader templates={templates} onLoad={load} onClear={clear} />,
    );
    const select = screen.getByLabelText("Templates");
    fireEvent.change(select, { target: { value: "one.html" } });
    expect(load).toHaveBeenCalledWith("one.html");
    fireEvent.change(select, { target: { value: "__clear__" } });
    expect(clear).toHaveBeenCalled();
  });

  it("calls onError when load throws", async () => {
    const load = vi.fn(() => {
      throw new Error("fail");
    });
    const handle = vi.fn();
    render(
      <TemplateLoader
        templates={templates}
        onLoad={load}
        onClear={() => {}}
        onError={handle}
      />,
    );
    fireEvent.change(screen.getByLabelText("Templates"), {
      target: { value: "one.html" },
    });
    expect(handle).toHaveBeenCalled();
  });
});
