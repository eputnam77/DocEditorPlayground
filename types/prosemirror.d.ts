declare module "prosemirror-state" {
  export class Plugin {
    constructor(config: any);
    getState(state: any): any;
    props: {
      decorations(this: { getState(state: any): any }, state: any): any;
      [key: string]: any;
    };
    spec: any;
  }
  export class PluginKey {
    constructor(name?: string);
    get(state: any): any;
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
