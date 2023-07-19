import type { Loginstate } from "../interfaces/Loginstate";
import { request } from "../utils/request";

export function checkLogin(): void {
  void request<Loginstate>(
    CONFIG["api-uri"] + "/v1.0/account",
    "GET",
    {},
    {
      401: () => {
        window.location.href =
          CONFIG["api-uri"] +
          "/v1.0/login?return-uri=" +
          encodeURIComponent(window.location.href);
      },
    },
  ).then((response) => {
    if (!["editor", "administrator", "superuser"].includes(response.role)) {
      window.location.replace(CONFIG["frontend-uri"]);
    }
  });
}
