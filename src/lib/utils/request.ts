import type {
  APIResponse,
  APISuccessResponse,
} from "$lib/interfaces/APIResponse";
import type { ExceptionHandler } from "$lib/interfaces/ExceptionHandler";
import type { Payload } from "$lib/interfaces/Payload";
import type { RequestResponse } from "$lib/interfaces/RequestResponse";

import { apiUri } from "$lib/config";
import { globalUI } from "$lib/globalUI.svelte";
import { reAuthSuspended } from "$lib/reAuthSuspension.svelte";
import { buildQuery } from "$lib/utils/buildQuery";

export function reAuth(): void {
  if (!reAuthSuspended.value) {
    window.location.href = `${apiUri}/v1.0/login?return-uri=${encodeURIComponent(window.location.href)}`;
  }
}

function isSuccessResponse<T extends RequestResponse>(
  response: APIResponse<T>,
): response is APISuccessResponse<T> {
  return Math.floor(response.status / 100) === 2;
}

export const authFailHandler: ExceptionHandler = {
  AuthenticationException: (): void => {
    globalUI.dialogMessage =
      "Proběhlo automatické odhlášení. Přihlašte se prosím a zkuste to znovu.";
  },
};

export async function request<T extends RequestResponse>(
  url: string,
  method: string,
  payload: FormData | Payload,
  exceptionHandler: ExceptionHandler = {},
): Promise<T> {
  const response = await rawRequest<T>(url, method, payload);
  if (isSuccessResponse(response)) {
    return response.response;
  } else if (
    "type" in response &&
    Object.prototype.hasOwnProperty.call(exceptionHandler, response.type)
  ) {
    const handler = exceptionHandler[response.type];
    if (handler !== undefined && handler !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- Cannot dynamically get response type
      handler(response as any);
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
    if ("message" in response) {
      globalUI.dialogMessage = `Nastala neznámá chyba. Chybová hláška: ${response.message}`;
    } else {
      globalUI.dialogMessage = "Nastala neznámá chyba.";
    }
    throw new Error();
  }
}

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
    query = buildQuery(payload as Payload);
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
          reject(new Error("Failed to parse JSON in request response."));
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
