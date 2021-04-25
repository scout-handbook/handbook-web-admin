/* exported ExceptionHandler */

interface ExceptionHandler {
  readonly [key: string]: ((response: APIResponse) => void) | null | undefined;
  AuthenticationException?: ((response: APIResponse) => void) | null;
  LockedException?: ((response: APIResponse) => void) | null;
  SkautISAuthorizationException?: ((response: APIResponse) => void) | null;
}
