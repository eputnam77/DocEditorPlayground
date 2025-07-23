// lint.ts
import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin, PluginKey } from "prosemirror-state";

export interface LintRule {
  match: (props: { tr: any }) => Array<{
    from: number;
    to: number;
    message: string;
    fix?: (view: any, from: number, to: number) => void;
  }>;
}

export default Extension.create<{ rule: LintRule }>({
  name: "lint",
  addOptions() {
    return {
      rule: {
        match: () => [],
      },
    };
  },
  addProseMirrorPlugins() {
    const { rule } = this.options;
    return [
      new Plugin({
        key: new PluginKey("lint"),
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            if (!tr.docChanged) return old;
            const decorations: any[] = [];
            const issues = rule.match({ tr });
            issues.forEach((issue) => {
              decorations.push(
                Decoration.inline(issue.from, issue.to, {
                  class: "lint-highlight",
                  title: issue.message,
                }),
              );
            });
            return DecorationSet.create(tr.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
