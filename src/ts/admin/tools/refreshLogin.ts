import { request } from "./request";

// TODO: Check where this is called
export function refreshLogin(
  forceRelogin = false,
  afterAction: (() => void) | null = null
): void {
  const allCookies = "; " + document.cookie;
  const parts = allCookies.split("; skautis_timeout=");
  if (parts.length === 2) {
    const timeout = parseInt(parts.pop()!.split(";").shift()!);
    if (timeout - Math.round(new Date().getTime() / 1000) < 1500) {
      const exceptionHandler = {
        AuthenticationException: function (): void {
          if (forceRelogin) {
            window.location.replace(
              CONFIG["api-uri"] +
                "/v1.0/login?return-uri=" +
                window.location.pathname
            );
          }
        },
      };
      void request(
        CONFIG["api-uri"] + "/v1.0/refresh",
        "GET",
        {},
        exceptionHandler
      ).then(() => {
        if (afterAction) {
          afterAction();
        }
      });
    }
  }
}
