import { describe, it } from "node:test";
import assert from "node:assert/strict";
import SlashCommand from "../../extensions/slash-command.js";

describe("slash-command extension", () => {
  it("uses suggestion label when executing command", () => {
    const calls: any[] = [];
    const insertContent = (arg: any) => {
      calls.push(arg);
      return { run() {} };
    };
    const command = SlashCommand.options.suggestion.command as any;
    command({
      editor: {
        chain: () => ({
          focus: () => ({
            deleteRange: () => ({ insertContent }),
          }),
        }),
      },
      range: {} as any,
      props: { label: "test" },
    });
    assert.deepStrictEqual(calls, ["test"]);
  });

  it("inserts empty string when label missing", () => {
    const calls: any[] = [];
    const insertContent = (arg: any) => {
      calls.push(arg);
      return { run() {} };
    };
    const command = SlashCommand.options.suggestion.command as any;
    command({
      editor: {
        chain: () => ({
          focus: () => ({
            deleteRange: () => ({ insertContent }),
          }),
        }),
      },
      range: {} as any,
      props: {},
    });
    assert.deepStrictEqual(calls, [""]);
  });
});
