declare module "fast-check" {
  export function anything(): any;
  export function property<T>(
    arbitrary: T,
    predicate: (value: T) => boolean,
  ): { check: () => boolean };
  export function assert(prop: { check: () => boolean }): void;
}
