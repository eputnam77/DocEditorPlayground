declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  type Element = any;
  interface ElementChildrenAttribute {
    children: {};
  }
}

declare module "react" {
  /** Minimal React type definitions for offline compilation */
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export function useState<S>(
    initialState: S | (() => S),
  ): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>,
  ];
  export const useEffect: any;
  export function useRef<T>(initial?: T | null): { current: T | null };
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[],
  ): T;
  const React: any;
  export default React;
  namespace React {
    export type Dispatch<A> = (value: A) => void;
    export type SetStateAction<S> = S | ((prevState: S) => S);
    export type FC<P = {}> = (props: P) => any;
    export interface ChangeEvent<T = Element> {
      target: T;
    }
    export type ReactNode = any;
  }
}

declare module "react-dom" {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module "next";
declare module "next/link" {
  const Link: any;
  export default Link;
}
declare module "next/app" {
  export interface AppProps {
    Component: any;
    pageProps: any;
  }
}
declare module "next/dynamic";
declare module "@playwright/test";

interface Window {
  __ckeditor?: any;
}
declare module "@tiptap/react";
declare module "@tiptap/starter-kit";
declare module "@testing-library/react";
declare module "vitest";
declare module "vitest/config";
declare module "fast-check";
