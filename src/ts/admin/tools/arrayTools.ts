export function get<T>(arr: Array<[string, T]>, id: string): T | undefined {
  return arr.find(([elementId, _]) => elementId === id)?.[1];
}

export function map<T>(arr: Array<[string, T]>, fn: (item: T) => T): void {
  arr.map(([id, value]) => [id, fn(value)]);
}

export function sort<T>(
  arr: Array<[string, T]>,
  comparator: (first: T, second: T) => number
): void {
  arr.sort(([_1, first], [_2, second]) => comparator(first, second));
}
