import type {
  indentCommand,
  outdentCommand,
} from "../extensions/tiptapIndentation";

type IndentReturn = ReturnType<typeof indentCommand>;
type OutdentReturn = ReturnType<typeof outdentCommand>;

declare module "@tiptap/core" {
  type IndentationCommandReturn<ReturnType> = ReturnType extends ChainedCommands
    ? ChainedCommands
    : ReturnType extends boolean
    ? IndentReturn & OutdentReturn
    : ReturnType;

  interface Commands<ReturnType = any> {
    indentation: {
      indent: () => IndentationCommandReturn<ReturnType>;
      outdent: () => IndentationCommandReturn<ReturnType>;
    };
  }

  interface ChainedCommands {
    indent(): IndentationCommandReturn<ChainedCommands>;
    outdent(): IndentationCommandReturn<ChainedCommands>;
  }
}
