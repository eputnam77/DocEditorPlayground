import { describe, it } from "vitest";
import assert from "node:assert/strict";
import SlashCommand, {
  SLASH_COMMAND_ITEMS,
  filterSlashCommandItems,
} from "../../extensions/slash-command.js";

/**
 * A chainable stub standing in for `editor.chain()`.
 *
 * Every command records the calls made against it so a test can assert on the
 * chain the extension built without instantiating a real editor.
 */
function createEditorStub() {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const chain: any = new Proxy(
    {},
    {
      get(_target, property: string) {
        if (property === "run") {
          return () => {
            calls.push({ method: "run", args: [] });
          };
        }
        return (...args: unknown[]) => {
          calls.push({ method: property, args });
          return chain;
        };
      },
    },
  );
  return { editor: { chain: () => chain }, calls };
}

describe("slash-command extension", () => {
  const command = SlashCommand.options.suggestion.command as any;

  it("deletes the typed query and applies the item in one chain", () => {
    // Two chains would leave the query text behind: deleting the range shifts
    // every position after it, so a second chain acts on stale positions.
    const { editor, calls } = createEditorStub();
    const range = { from: 4, to: 9 };

    command({
      editor,
      range,
      props: {
        label: "Heading 2",
        apply: (chain: any) => chain.setNode("heading", { level: 2 }),
      },
    });

    assert.deepStrictEqual(
      calls.map((call) => call.method),
      ["focus", "deleteRange", "setNode", "run"],
    );
    assert.deepStrictEqual(calls[1].args, [range]);
    assert.deepStrictEqual(calls[2].args, ["heading", { level: 2 }]);
  });

  it("falls back to inserting the label when the item has no command", () => {
    const { editor, calls } = createEditorStub();

    command({ editor, range: {}, props: { label: "test" } });

    const insert = calls.find((call) => call.method === "insertContent");
    assert.deepStrictEqual(insert?.args, ["test"]);
  });

  it("inserts empty string when label missing", () => {
    const { editor, calls } = createEditorStub();

    command({ editor, range: {}, props: {} });

    const insert = calls.find((call) => call.method === "insertContent");
    assert.deepStrictEqual(insert?.args, [""]);
  });

  it("gives every listed item something to apply", () => {
    for (const item of SLASH_COMMAND_ITEMS) {
      assert.strictEqual(
        typeof item.apply,
        "function",
        `${item.label} has no apply()`,
      );
    }
  });

  it("offers a non-empty menu", () => {
    // The menu previously returned no items at all, so typing "/" did nothing.
    assert.ok(SLASH_COMMAND_ITEMS.length > 0);
    assert.deepStrictEqual(
      filterSlashCommandItems(""),
      SLASH_COMMAND_ITEMS,
    );
  });

  it("filters by label and by keyword", () => {
    const byLabel = filterSlashCommandItems("bullet").map((item) => item.label);
    assert.deepStrictEqual(byLabel, ["Bullet list"]);

    // "ul" appears only in the keywords, not the label.
    const byKeyword = filterSlashCommandItems("ul").map((item) => item.label);
    assert.deepStrictEqual(byKeyword, ["Bullet list"]);

    assert.deepStrictEqual(filterSlashCommandItems("nothing-matches"), []);
  });
});
