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
  export interface MutableRefObject<T> {
    current: T;
  }
  export type RefObject<T> = MutableRefObject<T | null>;
  export type RefCallback<T> = (instance: T | null) => void;
  export type Ref<T> = RefObject<T> | RefCallback<T> | null;
  export function useState<S>(
    initialState: S | (() => S),
  ): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>,
  ];
  export const useEffect: any;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): MutableRefObject<
    T | null
  >;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[],
  ): T;
  export interface Context<T> {
    Provider: React.FC<{ value: T; children?: React.ReactNode }>;
    Consumer: React.FC<{ children: (value: T) => React.ReactNode }>;
    _currentValue: T;
  }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export type ForwardRefRenderFunction<T, P = {}> = (
    props: P,
    ref: React.Ref<T>,
  ) => any;
  export function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>,
  ): React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;
  export function useImperativeHandle<T, R extends T>(
    ref: React.Ref<T> | undefined,
    init: () => R,
    deps?: any[],
  ): void;
  const React: any;
  export default React;
  namespace React {
    export type Dispatch<A> = (value: A) => void;
    export type SetStateAction<S> = S | ((prevState: S) => S);
    export type FC<P = {}> = (props: P) => any;
    export interface MutableRefObject<T> {
      current: T;
    }
    export type RefObject<T> = MutableRefObject<T | null>;
    export type RefCallback<T> = (instance: T | null) => void;
    export type Ref<T> = RefObject<T> | RefCallback<T> | null;
    export interface ChangeEvent<T = Element> {
      target: T;
    }
    export interface FormEvent<T = Element> {
      target: T;
      preventDefault(): void;
    }
    export type ReactNode = any;
    export interface HTMLAttributes<T> {
      [key: string]: any;
    }
    export interface RefAttributes<T> {
      ref?: Ref<T>;
    }
    export interface ForwardRefExoticComponent<P> {
      (props: P): any;
    }
    export interface Context<T> {
      Provider: FC<{ value: T; children?: ReactNode }>;
      Consumer: FC<{ children: (value: T) => ReactNode }>;
      _currentValue: T;
    }
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
