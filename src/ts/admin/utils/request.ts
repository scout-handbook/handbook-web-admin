import { get } from "svelte/store";

import type { APIResponse } from "../interfaces/APIResponse";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { Payload } from "../interfaces/Payload";
import type { RequestResponse } from "../interfaces/RequestResponse";

import { globalDialogMessage, suspendReAuth } from "../stores";
import { constructQuery } from "./constructURL";

export function reAuth(): void {
  if (!get(suspendReAuth)) {
    window.location.href = `${CONFIG["api-uri"]}/v1.0/login?return-uri=${encodeURIComponent(window.location.href)}`;
  }
}

export const authFailHandler: ExceptionHandler = {
  AuthenticationException: (): void => {
    globalDialogMessage.set(
      "Proběhlo automatické odhlášení. Přihlašte se prosím a zkuste to znovu.",
    );
  },
};

async function rawRequest<T extends RequestResponse>(
  url: string,
  method: string,
  payload: FormData | Payload = {},
): Promise<APIResponse<T>> {
  let fullUrl = url;
  let query = "";
  if (
    method === "GET" ||
    method === "DELETE" ||
    payload.toString() !== "[object FormData]"
  ) {
    query = constructQuery(payload as Payload);
  }
  if ((method === "GET" || method === "DELETE") && query) {
    fullUrl += `?${query}`;
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (): void {
      if (this.readyState === 4) {
        try {
          resolve(JSON.parse(this.responseText) as APIResponse<T>);
        } catch {
          reject(new Error());
        }
      }
    };
    xhr.open(method, fullUrl, true);
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
  });
}

export async function request<T extends RequestResponse>(
  url: string,
  method: string,
  payload: FormData | Payload,
  exceptionHandler: ExceptionHandler = {},
): Promise<T> {
  const response = await rawRequest<T>(url, method, payload);
  if (Math.floor(response.status / 100) === 2) {
    if (response.response === undefined) {
      throw new Error();
    }
    return response.response;
  } else if (
    response.type !== undefined &&
    Object.prototype.hasOwnProperty.call(exceptionHandler, response.type)
  ) {
    const handler = exceptionHandler[response.type];
    if (handler !== undefined && handler !== null) {
      handler(response);
    }
    throw new Error();
  } else if (
    response.status === 401 &&
    Object.prototype.hasOwnProperty.call(exceptionHandler, "401") &&
    exceptionHandler["401"] !== undefined &&
    exceptionHandler["401"] !== null
  ) {
    exceptionHandler["401"](response);
    throw new Error();
  } else {
    globalDialogMessage.set(
      `Nastala neznámá chyba. Chybová hláška: ${response.message ?? ""}`,
    );
    throw new Error();
  }
}
