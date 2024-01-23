import type { APIResponse } from "$lib/interfaces/APIResponse";
import type { RequestResponse } from "$lib/interfaces/RequestResponse";

export interface ExceptionHandler {
  readonly [key: string]:
    | ((response: APIResponse<RequestResponse>) => void)
    | null
    | undefined;
  AuthenticationException?:
    | ((response: APIResponse<RequestResponse>) => void)
    | null;
  LockedException?: ((response: APIResponse<RequestResponse>) => void) | null;
  SkautISAuthorizationException?:
    | ((response: APIResponse<RequestResponse>) => void)
    | null;
}
