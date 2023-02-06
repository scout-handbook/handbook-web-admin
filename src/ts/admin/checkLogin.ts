import type { Loginstate } from "./interfaces/Loginstate";
import { globalDialogMessage } from "./stores";
import { rawRequest } from "./tools/request";

export function checkLogin(): void {
  void rawRequest<Loginstate>(
    CONFIG["api-uri"] + "/v1.0/account",
    "GET",
    undefined
  ).then((response) => {
    if (response.status === 200) {
      if (
        !["editor", "administrator", "superuser"].includes(
          response.response!.role
        )
      ) {
        window.location.replace(CONFIG["frontend-uri"]);
      }
    } else if (response.status === 401) {
      window.location.href =
        CONFIG["api-uri"] +
        "/v1.0/login?return-uri=" +
        encodeURIComponent(window.location.href);
    } else {
      globalDialogMessage.set(
        "Nastala neznámá chyba. Chybová hláška: " + response.message!
      );
    }
  });
}
