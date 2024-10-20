import { QueryClient } from "@tanstack/svelte-query";
import { get } from "svelte/store";

import type { Payload } from "../interfaces/Payload";
import type { RequestResponse } from "../interfaces/RequestResponse";

import { apiUri } from "../stores";
import { reAuth, request } from "./request";

function constructQuery(searchParams: Payload): string {
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

async function queryFn({
  queryKey,
}: {
  queryKey: ReadonlyArray<unknown>;
}): Promise<RequestResponse> {
  let uri = queryKey.filter((elem) => typeof elem === "string").join("/");
  const query = constructQuery(
    (queryKey.find((elem) => typeof elem === "object") as
      | Payload
      | undefined) ?? {},
  );
  if (query !== "") {
    uri += `?${query}`;
  }
  return request(
    `${get(apiUri)}/${uri}`,
    "GET",
    {},
    {
      401: reAuth,
      AuthenticationException: reAuth,
      RoleException: (): void => {
        window.location.replace(CONFIG["frontend-uri"]);
      },
    },
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn,
    },
  },
});
