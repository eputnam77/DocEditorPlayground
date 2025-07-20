# Tester Failures

- **npm ci --dry-run** failed: unable to fetch git dependency due to network restrictions.
- **Unit tests** could not run: missing dependency `@vitest/coverage-v8` and network access was disabled.
- Coverage HTML not generated; placeholder added at `reports/coverage/`.

Next agent: `ready-for:builder`

TypeScript error sample:

extensions/tiptapIndentation.ts(17,5): error TS2322: Type '(this: { name: string; options: any; storage: any; editor: Editor; parent: (() => Partial<RawCommands>) | undefined; }) => { indent: () => ({ commands }: { commands: any; }) => any; outdent: () => ({ commands }: { ...; }) => any; }' is not assignable to type '(this: { name: string; options: any; storage: any; editor: Editor; parent: (() => Partial<RawCommands>) | undefined; }) => Partial<RawCommands>'.
  Type '{ indent: () => ({ commands }: { commands: any; }) => any; outdent: () => ({ commands }: { commands: any; }) => any; }' has no properties in common with type 'Partial<RawCommands>'.
