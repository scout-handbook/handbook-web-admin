import { createDefaultSWR } from "sswr";

import type { RequestResponse } from "./interfaces/RequestResponse";

import { reAuth, request } from "./utils/request";

export function setupSWR(): void {
  createDefaultSWR({
    dedupingInterval: 60000,
    fetcher: async (url: string): Promise<RequestResponse> =>
      request(
        url,
        "GET",
        {},
        {
          401: reAuth,
          AuthenticationException: reAuth,
          RoleException: (): void => {
            window.location.replace(CONFIG["frontend-uri"]);
          },
        },
      ),
  });
}
