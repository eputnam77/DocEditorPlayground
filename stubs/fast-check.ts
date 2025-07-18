export function anything(): any {
  return undefined;
}

export function property<T>(_: T, predicate: (value: T) => boolean) {
  return { check: () => predicate(undefined as unknown as T) };
}

export function assert(prop: { check: () => boolean }): void {
  if (!prop.check()) {
    throw new Error("Property failed");
  }
}
