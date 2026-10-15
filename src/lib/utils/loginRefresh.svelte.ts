import { apiUri } from "#lib/config.js";
import { reAuth, request } from "#lib/utils/request.js";

export const afterRefreshCallback: { value: (() => void) | null } = $state({
  value: null,
});

export function loginRefreshSetup(): void {
  setTimeout(refreshLogin, 20 * 60);
}

function refreshLogin(): void {
  void request(
    `${apiUri}/v1.0/refresh`,
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    },
  ).then(() => {
    setTimeout(refreshLogin, 20 * 60 * 1000);
    if (afterRefreshCallback.value !== null) {
      afterRefreshCallback.value();
    }
  });
}
