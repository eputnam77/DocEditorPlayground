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
  export function useState<T>(
    initial: T | (() => T),
  ): [T, (value: T | ((prev: T) => T)) => void];
  export const useEffect: any;
  export function useRef<T>(initial?: T | null): { current: T | null };
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[],
  ): T;
  export type ReactNode = any;
  const React: any;
  export default React;
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
