export function get<T>(arr: Array<[string, T]>, id: string): T | undefined {
  return arr.find(([elementId, _]) => elementId === id)?.[1];
}
