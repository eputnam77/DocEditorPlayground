import { describe, it, expect } from "vitest";
import { createWatermarkPlugin } from "../../extensions/tiptapWatermark";

describe("tiptapWatermark", () => {
  it("mounts and cleans up the watermark overlay", () => {
    const plugin = createWatermarkPlugin("Demo");
    const parent = document.createElement("div");
    const dom = document.createElement("div");
    parent.appendChild(dom);

    const view = plugin.spec.view({ dom });
    expect(dom.getAttribute("data-watermark")).toBe("Demo");
    expect(parent.textContent).toContain("Demo");

    view.destroy();
    expect(parent.textContent).toBe("");
    expect(dom.hasAttribute("data-watermark")).toBe(false);
  });

  it("restores previous watermark attribute when destroyed", () => {
    const plugin = createWatermarkPlugin("New");
    const parent = document.createElement("div");
    const dom = document.createElement("div");
    dom.setAttribute("data-watermark", "Old");
    parent.appendChild(dom);

    const view = plugin.spec.view({ dom });
    expect(dom.getAttribute("data-watermark")).toBe("New");
    view.destroy();
    expect(dom.getAttribute("data-watermark")).toBe("Old");
  });

});
