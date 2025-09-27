declare module "prosemirror-state" {
  export interface EditorState {
    doc: unknown;
  }

  export interface Transaction {
    docChanged: boolean;
    doc: unknown;
  }

  export interface PluginStateField<State> {
    init(config: { state: EditorState }, instance: EditorState): State;
    apply(
      tr: Transaction,
      value: State,
      oldState?: EditorState,
      newState?: EditorState,
    ): State;
  }

  export type DecorationsHandler<State> =
    | ((this: Plugin<State>, state: EditorState) => import("prosemirror-view").DecorationSet | null | undefined)
    | ((state: EditorState) => import("prosemirror-view").DecorationSet | null | undefined);

  export interface PluginProps<State> {
    decorations?: DecorationsHandler<State>;
    [key: string]: any;
  }

  export interface PluginSpec<State = unknown> {
    key?: PluginKey<State>;
    state?: PluginStateField<State>;
    props?: PluginProps<State>;
    [key: string]: any;
  }

  export class Plugin<State = unknown> {
    constructor(spec: PluginSpec<State>);
    readonly spec: PluginSpec<State>;
    readonly props?: PluginProps<State>;
    getState(state: EditorState): State | undefined;
  }

  export class PluginKey<State = unknown> {
    constructor(name?: string);
    get(state: EditorState): Plugin<State> | undefined;
    getState(state: EditorState): State | undefined;
  }

  export const TextSelection: any;
}

declare module "prosemirror-model" {
  export interface Node {
    type: { name: string };
    attrs: any;
    text?: string;
  }
}

declare module "prosemirror-view" {
  export class Decoration {
    static inline(
      from: number,
      to: number,
      attrs?: Record<string, any>,
      spec?: any,
    ): Decoration;
  }

  export class DecorationSet {
    static empty: DecorationSet;
    static create(doc: unknown, decorations: Decoration[]): DecorationSet;
  }
}
