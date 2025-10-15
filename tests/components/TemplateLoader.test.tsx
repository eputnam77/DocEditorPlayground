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

  it("drops malformed template entries while keeping valid ones", () => {
    const noisy = [
      { label: "One", filename: "one.html" },
      { label: 123, filename: "number.html" },
      { label: "Two", filename: null },
      { label: true, filename: "bool.html" },
    ] as unknown[];

    render(
      <TemplateLoader templates={noisy as TemplateMeta[]} onLoad={() => {}} onClear={() => {}} />,
    );

    const options = screen
      .getAllByRole("option")
      .filter((opt) => opt.value !== "" && opt.value !== "__clear__");

    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("One");
    expect(options[0].getAttribute("value")).toBe("one.html");
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

  it("treats filenames case-insensitively when checking duplicates", () => {
    const noisy: any = [
      { label: "Upper", filename: "DOC.html" },
      { label: "Lower", filename: "doc.HTML" },
    ];
    render(
      <TemplateLoader templates={noisy} onLoad={() => {}} onClear={() => {}} />,
    );
    const opts = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "" && o.value !== "__clear__");
    expect(opts).toHaveLength(1);
    expect(opts[0].value).toBe("DOC.html");
  });

  it("accepts string-like template values", () => {
    const funky: any = [
      { label: new String("Fancy"), filename: new String("fancy.html") },
    ];
    render(
      <TemplateLoader templates={funky} onLoad={() => {}} onClear={() => {}} />,
    );
    const opts = screen
      .getAllByRole("option")
      .filter((o) => o.value !== "" && o.value !== "__clear__");
    expect(opts).toHaveLength(1);
    expect(opts[0].value).toBe("fancy.html");
    expect(opts[0].textContent).toBe("Fancy");
  });

  it("accesses template fields only once", () => {
    let calls = 0;
    const tpl: any = {};
    Object.defineProperty(tpl, "filename", {
      get() {
        calls++;
        if (calls > 1) throw new Error("getter called twice");
        return "one.html";
      },
    });
    Object.defineProperty(tpl, "label", {
      get() {
        return "One";
      },
    });
    render(
      <TemplateLoader templates={[tpl]} onLoad={() => {}} onClear={() => {}} />,
    );
    expect(calls).toBe(1);
  });
});
