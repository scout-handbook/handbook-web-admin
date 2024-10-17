import { QueryClient } from "@tanstack/svelte-query";
import { get } from "svelte/store";

import type { RequestResponse } from "../interfaces/RequestResponse";

import { apiUri } from "../stores";
import { reAuth, request } from "./request";

const queryFn = async ({
  queryKey,
}: {
  queryKey: ReadonlyArray<unknown>;
}): Promise<RequestResponse> =>
  request(
    `${get(apiUri)}/${queryKey.join("/")}`,
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn,
    },
  },
});
