import { describe, it, expect, vi } from "vitest";
import SlashCommand from "../../extensions/slash-command";

describe("slash-command extension", () => {
  it("uses suggestion label when executing command", () => {
    const insertContent = vi.fn().mockReturnValue({ run: vi.fn() });
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
    expect(insertContent).toHaveBeenCalledWith("test");
  });
});
