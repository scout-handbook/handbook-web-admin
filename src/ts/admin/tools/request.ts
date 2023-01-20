import type { APIResponse } from "../interfaces/APIResponse";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { Payload } from "../interfaces/Payload";
import type { RequestResponse } from "../interfaces/RequestResponse";
import { globalDialogMessage } from "../stores";

export const reAuthHandler: ExceptionHandler = {
  AuthenticationException: function (): void {
    window.location.replace(CONFIG["api-uri"] + "/v1.0/login");
  },
};

export const authFailHandler = {
  AuthenticationException: function (): void {
    globalDialogMessage.set(
      "Proběhlo automatické odhlášení. Přihlašte se prosím a zkuste to znovu."
    );
  },
};

function requestQueryBuilder(payload: Payload): string {
  let query = "";
  let first = true;
  for (const key in payload) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) {
      continue;
    }
    if (Array.isArray(payload[key])) {
      for (const instance of payload[key] as Array<string>) {
        if (!first) {
          query += "&";
        }
        query += key + "[]=" + instance;
        first = false;
      }
    } else {
      if (!first) {
        query += "&";
      }
      query += key + "=" + (payload[key] as string);
    }
    first = false;
  }
  return query;
}

export function rawRequest(
  url: string,
  method: string,
  payload: FormData | Payload = {},
  callback: (response: APIResponse) => void
): void {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (): void {
    if (this.readyState === 4) {
      callback(JSON.parse(this.responseText) as APIResponse);
    }
  };
  let query = "";
  if (
    method === "GET" ||
    method === "DELETE" ||
    payload.toString() !== "[object FormData]"
  ) {
    query = requestQueryBuilder(payload as Payload);
  }
  if ((method === "GET" || method === "DELETE") && query) {
    url += "?" + query;
  }
  xhr.open(method, url, true);
  if (
    method === "GET" ||
    method === "DELETE" ||
    payload.toString() !== "[object FormData]"
  ) {
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  if (method === "GET" || method === "DELETE") {
    xhr.send();
  } else if (payload.toString() !== "[object FormData]") {
    xhr.send(query);
  } else {
    xhr.send(payload as unknown as string);
  }
}

export function request(
  url: string,
  method: string,
  payload: FormData | Payload,
  callback: (response: RequestResponse) => void,
  exceptionHandler: ExceptionHandler = {}
): void {
  rawRequest(url, method, payload, function (response): void {
    if (Math.floor(response.status / 100) === 2) {
      callback(response.response!);
    } else if (
      Object.prototype.hasOwnProperty.call(exceptionHandler, response.type!)
    ) {
      exceptionHandler[response.type!]!(response);
    } else {
      globalDialogMessage.set(
        "Nastala neznámá chyba. Chybová hláška: " + response.message!
      );
    }
  });
}
