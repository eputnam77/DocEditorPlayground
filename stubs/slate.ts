import { runContentEditableCommand } from "../utils/contentEditableCommands";

export interface Editor {
  rootRef: { current: HTMLDivElement | null };
  exec(command: string, value?: string): void;
  getHTML(): string;
  getText(): string;
}

export function createEditor(): Editor {
  const rootRef = { current: null as HTMLDivElement | null };
  return {
    rootRef,
    exec(command: string, value?: string) {
      runContentEditableCommand({
        command,
        value,
        root: rootRef.current,
      });
    },
    getHTML() {
      return rootRef.current?.innerHTML || '';
    },
    getText() {
      return rootRef.current?.innerText || '';
    },
  };
}
