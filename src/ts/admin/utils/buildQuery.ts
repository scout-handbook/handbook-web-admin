import type { Payload } from "../interfaces/Payload";

export function buildQuery(searchParams: Payload): string {
  const pairs: Array<string> = [];
  for (const key in searchParams) {
    if (!Object.prototype.hasOwnProperty.call(searchParams, key)) {
      continue;
    }
    const value = searchParams[key];
    if (Array.isArray(value)) {
      for (const instance of value) {
        pairs.push(`${key}[]=${instance}`);
      }
    } else if (value !== undefined) {
      pairs.push(`${key}=${value.toString()}`);
    }
  }
  return pairs.join("&");
}
