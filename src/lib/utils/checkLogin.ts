import type { Loginstate } from "$lib/interfaces/Loginstate";

import { apiUri, frontendUri } from "$lib/config";
import { request } from "$lib/utils/request";

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
