import { createDefaultSWR } from "sswr";

import type { RequestResponse } from "./interfaces/RequestResponse";
import { reAuthHandler, request } from "./tools/request";

export function SWRSetup(): void {
  createDefaultSWR({
    fetcher: async (url: string): Promise<RequestResponse> =>
      request(url, "GET", {}, reAuthHandler),
  });
}
