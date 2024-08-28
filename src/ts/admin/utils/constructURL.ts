import { get } from "svelte/store";

import type { Payload } from "../interfaces/Payload";

import { apiUri } from "../stores";

export function constructQuery(searchParams: Payload): string {
  const pairs: Array<string> = [];
  for (const key in searchParams) {
    if (!Object.prototype.hasOwnProperty.call(searchParams, key)) {
      continue;
    }
    const value = searchParams[key];
    if (Array.isArray(value)) {
      for (const instance of value) {
        pairs.push(key + "[]=" + instance);
      }
    } else if (value !== undefined) {
      pairs.push(key + "=" + value.toString());
    }
  }
  return pairs.join("&");
}

export function constructURL(path: string, searchParams: Payload = {}): string {
  const query = constructQuery(searchParams);
  let url = get(apiUri) + "/" + path;
  if (query !== "") {
    url += "?" + query;
  }
  return url;
}
