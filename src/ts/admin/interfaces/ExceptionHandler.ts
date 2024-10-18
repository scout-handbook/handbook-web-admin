import type {
  AuthenticationExceptionResponse,
  Error401Response,
  LockedExceptionResponse,
  NotFoundExceptionResponse,
  NotLockedExceptionResponse,
  RoleExceptionResponse,
  SkautISAuthorizationExceptionResponse,
} from "./APIResponse";

export interface ExceptionHandler {
  401?: ((response: Error401Response) => void) | null;
  AuthenticationException?:
    | ((response: AuthenticationExceptionResponse) => void)
    | null;
  LockedException?: ((response: LockedExceptionResponse) => void) | null;
  NotFoundException?: ((response: NotFoundExceptionResponse) => void) | null;
  NotLockedException?: ((response: NotLockedExceptionResponse) => void) | null;
  RoleException?: ((response: RoleExceptionResponse) => void) | null;
  SkautISAuthorizationException?:
    | ((response: SkautISAuthorizationExceptionResponse) => void)
    | null;
}
