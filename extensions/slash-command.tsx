// slash-command.ts
import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";

interface SlashCommandItem {
  label: string;
}

export interface SlashCommandOptions {
  // The suggestion configuration excluding the editor instance
  suggestion: Omit<SuggestionOptions<SlashCommandItem>, "editor">;
}

export default Extension.create<SlashCommandOptions>({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: SlashCommandItem;
        }) => {
          // default: insert text
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(props.label)
            .run();
        },
        items: () => [],
      },
    };
  },
  addProseMirrorPlugins() {
    const { suggestion } = this.options;
    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
      }),
    ];
  },
});
