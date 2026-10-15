import type { Loginstate } from "#lib/interfaces/Loginstate.js";

import { apiUri, frontendUri } from "#lib/config.js";
import { request } from "#lib/utils/request.js";

export function checkLogin(): void {
  void request<Loginstate>(
    `${apiUri}/v1.0/account`,
    "GET",
    {},
    {
      401: () => {
        window.location.href = `${apiUri}/v1.0/login?return-uri=${encodeURIComponent(window.location.href)}`;
      },
    },
  ).then((response) => {
    if (!["administrator", "editor", "superuser"].includes(response.role)) {
      window.location.replace(frontendUri);
    }
  });
}
