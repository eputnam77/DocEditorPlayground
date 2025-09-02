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
      if (typeof document !== 'undefined' && typeof (document as any).execCommand === 'function') {
        (document as any).execCommand(command, false, value);
      }
    },
    getHTML() {
      return rootRef.current?.innerHTML || '';
    },
    getText() {
      return rootRef.current?.innerText || '';
    },
  };
}
