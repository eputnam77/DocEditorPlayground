import { describe, it, expect, vi } from "vitest";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin, PluginKey } from "prosemirror-state";

function createLintPlugin(rule: { match: (a: { tr: any }) => any[] }) {
  return new Plugin({
    key: new PluginKey("lint"),
    state: {
      init: () => DecorationSet.empty,
      apply(tr, old) {
        if (!tr.docChanged) return old;
        const decorations: any[] = [];
        const issues = rule.match({ tr });
        issues.forEach((issue) => {
          const from = Number(issue.from);
          const to = Number(issue.to);
          if (
            Number.isFinite(from) &&
            Number.isFinite(to) &&
            from >= 0 &&
            to > from
          ) {
            decorations.push(
              Decoration.inline(from, to, {
                class: "lint-highlight",
                title: issue.message,
              }),
            );
          }
        });
        return DecorationSet.create(tr.doc, decorations);
      },
    },
    props: {
      decorations(this: any, state) {
        return this.getState(state);
      },
    },
  });
}

describe("lint extension", () => {
  it("skips invalid ranges", () => {
    const plugin = createLintPlugin({
      match: () => [
        { from: 5, to: 3, message: "bad" },
        { from: 0, to: 1, message: "ok" },
      ],
    });
    const spyInline = vi.spyOn(Decoration, "inline");
    const spyCreate = vi
      .spyOn(DecorationSet, "create")
      .mockReturnValue(DecorationSet.empty as any);
    const tr = { docChanged: true, doc: {} } as any;
    expect(() => plugin.spec.state!.apply(tr, DecorationSet.empty)).not.toThrow();
    expect(spyInline).toHaveBeenCalledTimes(1);
    expect(spyInline).toHaveBeenCalledWith(0, 1, expect.any(Object));
    spyInline.mockRestore();
    spyCreate.mockRestore();
  });
});
