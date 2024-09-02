import type { APIResponse } from "./APIResponse";
import type { RequestResponse } from "./RequestResponse";

export interface ExceptionHandler {
  AuthenticationException?:
    | ((response: APIResponse<RequestResponse>) => void)
    | null;
  LockedException?: ((response: APIResponse<RequestResponse>) => void) | null;
  readonly [key: string]:
    | ((response: APIResponse<RequestResponse>) => void)
    | null
    | undefined;
  SkautISAuthorizationException?:
    | ((response: APIResponse<RequestResponse>) => void)
    | null;
}
