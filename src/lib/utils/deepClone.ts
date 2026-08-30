/** Deep-clones plain JSON data. Replaces `structuredClone`, which needs Safari 15.4. */
export function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => deepClone(item)) as T;
  }
  if (typeof value === "object" && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = deepClone(item);
    }
    return result as T;
  }
  return value;
}
