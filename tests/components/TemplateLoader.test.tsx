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
    const select = screen.getByLabelText("Templates") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "one.html" } });
    expect(load).toHaveBeenCalledWith("one.html");
    fireEvent.change(select, { target: { value: "__clear__" } });
    expect(clear).toHaveBeenCalled();
    // the select should reset so the same option can be chosen again
    expect(select.value).toBe("");
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

  it("ignores templates missing fields or duplicates", () => {
    const noisy: any = [
      { label: "One", filename: "one.html" },
      { label: "Bad" },
      { filename: "two.html" },
      { label: "One", filename: "one.html" },
      { label: "Two", filename: "two.html" },
    ];
    render(
      <TemplateLoader templates={noisy} onLoad={() => {}} onClear={() => {}} />,
    );
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toContain("One");
    expect(options).toContain("Two");
    expect(options.filter((t) => t === "One").length).toBe(1);
    expect(options).not.toContain("Bad");
  });

  it("trims whitespace and rejects blank values", () => {
    const noisy: any = [
      { label: "  One  ", filename: "  one.html  " },
      { label: "   ", filename: "two.html" }, // blank label
      { label: "Two", filename: "   " }, // blank filename
      { label: "One", filename: "one.html" }, // duplicate after trimming
    ];
    render(
      <TemplateLoader templates={noisy} onLoad={() => {}} onClear={() => {}} />,
    );
    const opts = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "" && o.value !== "__clear__");
    // Only one valid template should remain and values should be trimmed
    expect(opts).toHaveLength(1);
    expect(opts[0].value).toBe("one.html");
    expect(opts[0].textContent).toBe("One");
  });
});
