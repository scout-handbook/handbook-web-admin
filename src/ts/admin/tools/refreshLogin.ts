import { get } from "svelte/store";

import { afterReAuthAction } from "../stores";
import { reAuth, request } from "./request";

// TODO: Check where this is called
export function refreshLogin(): void {
  const allCookies = "; " + document.cookie;
  const parts = allCookies.split("; skautis_timeout=");
  if (parts.length === 2) {
    const timeout = parseInt(parts.pop()!.split(";").shift()!);
    if (timeout - Math.round(new Date().getTime() / 1000) < 1500) {
      void request(
        CONFIG["api-uri"] + "/v1.0/refresh",
        "GET",
        {},
        {
          AuthenticationException: reAuth,
        }
      ).then(() => {
        const afterAction = get(afterReAuthAction);
        if (afterAction !== null) {
          afterAction();
        }
      });
    }
  }
}
