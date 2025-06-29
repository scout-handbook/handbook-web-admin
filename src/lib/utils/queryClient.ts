import type { Payload } from "$lib/interfaces/Payload";
import type { RequestResponse } from "$lib/interfaces/RequestResponse";

import { browser } from "$app/environment";
import { apiUri, frontendUri } from "$lib/config";
import { buildQuery } from "$lib/utils/buildQuery";
import { reAuth, request } from "$lib/utils/request";
import { QueryClient } from "@tanstack/svelte-query";

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
