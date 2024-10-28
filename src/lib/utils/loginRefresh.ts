import { afterReAuthAction } from "$lib/stores";
import { reAuth, request } from "$lib/utils/request";
import { get } from "svelte/store";

function refreshLogin(): void {
  void request(
    `${CONFIG["api-uri"]}/v1.0/refresh`,
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    },
  ).then(() => {
    setTimeout(refreshLogin, 20 * 60 * 1000);
    const afterAction = get(afterReAuthAction);
    if (afterAction !== null) {
      afterAction();
    }
  });
}

export function loginRefreshSetup(): void {
  setTimeout(refreshLogin, 20 * 60);
}
