export function filter<T>(
  arr: Array<[string, T]>,
  fn: (id: string) => boolean
): Array<[string, T]> {
  return arr.filter(([id, _]) => fn(id));
}

export function get<T>(arr: Array<[string, T]>, id: string): T | undefined {
  return arr.find(([elementId, _]) => elementId === id)?.[1];
}

export function map<T, U>(
  arr: Array<[string, T]>,
  fn: (item: T) => U
): Array<[string, U]> {
  return arr.map(([id, value]) => [id, fn(value)]);
}

export function sort<T>(
  arr: Array<[string, T]>,
  comparator: (first: T, second: T) => number
): Array<[string, T]> {
  return arr.sort(([_1, first], [_2, second]) => comparator(first, second));
}
