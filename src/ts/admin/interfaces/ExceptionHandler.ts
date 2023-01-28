import type { APIResponse } from "./APIResponse";
import type { RequestResponse } from "./RequestResponse";

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
