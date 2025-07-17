declare module "prosemirror-state" {
  export const TextSelection: any;
  export const Plugin: any;
}

declare module "prosemirror-model" {
  export interface Node {
    type: { name: string };
    attrs: any;
    text?: string;
  }
}
