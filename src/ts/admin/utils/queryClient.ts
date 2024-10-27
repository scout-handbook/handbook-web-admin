import { QueryClient } from "@tanstack/svelte-query";
import { get } from "svelte/store";

import type { Payload } from "../interfaces/Payload";
import type { RequestResponse } from "../interfaces/RequestResponse";

import { apiUri } from "../stores";
import { buildQuery } from "./buildQuery";
import { reAuth, request } from "./request";

async function queryFn({
  queryKey,
}: {
  queryKey: ReadonlyArray<unknown>;
}): Promise<RequestResponse> {
  let uri = queryKey.filter((elem) => typeof elem === "string").join("/");
  const query = buildQuery(
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
      staleTime: 60 * 1000, // 1 minute
    },
  },
});
