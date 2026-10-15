import { browser } from "$app/env";
import { QueryClient } from "@tanstack/svelte-query";

import type { Payload } from "#lib/interfaces/Payload.js";
import type { RequestResponse } from "#lib/interfaces/RequestResponse.js";

import { apiUri, frontendUri } from "#lib/config.js";
import { buildQuery } from "#lib/utils/buildQuery.js";
import { reAuth, request } from "#lib/utils/request.js";

async function queryFn({
  queryKey,
}: {
  queryKey: ReadonlyArray<unknown>;
}): Promise<RequestResponse> {
  let uri = queryKey.filter((elem) => typeof elem === "string").join("/");
  const query = buildQuery(
    (queryKey.find((elem) => typeof elem === "object") as
      Payload | undefined) ?? {},
  );
  if (query !== "") {
    uri += `?${query}`;
  }
  return request(
    `${apiUri}/${uri}`,
    "GET",
    {},
    {
      401: reAuth,
      AuthenticationException: reAuth,
      RoleException: (): void => {
        window.location.replace(frontendUri);
      },
    },
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
      queryFn,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});
