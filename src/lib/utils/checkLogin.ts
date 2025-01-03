import type { Loginstate } from "$lib/interfaces/Loginstate";

import { request } from "$lib/utils/request";

export function checkLogin(): void {
  void request<Loginstate>(
    `${CONFIG["api-uri"]}/v1.0/account`,
    "GET",
    {},
    {
      401: () => {
        window.location.href = `${CONFIG["api-uri"]}/v1.0/login?return-uri=${encodeURIComponent(window.location.href)}`;
      },
    },
  ).then((response) => {
    if (!["administrator", "editor", "superuser"].includes(response.role)) {
      window.location.replace(CONFIG["frontend-uri"]);
    }
  });
}
