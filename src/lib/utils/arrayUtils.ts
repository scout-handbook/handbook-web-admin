export function filter<T>(
  arr: Array<[string, T]>,
  fn: (id: string) => boolean,
): Array<[string, T]> {
  return arr.filter(([id, _]) => fn(id));
}

export function map<T, U>(
  arr: Array<[string, T]>,
  fn: (item: T) => U,
): Array<[string, U]> {
  return arr.map(([id, value]) => [id, fn(value)]);
}
