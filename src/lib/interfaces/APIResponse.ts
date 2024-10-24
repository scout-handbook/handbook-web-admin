import type { RequestResponse } from "$lib/interfaces/RequestResponse";

export interface APISuccessResponse<T extends RequestResponse> {
  response: T;
  status: 200 | 201;
}

export interface Error401Response {
  status: 401;
}

export interface AuthenticationExceptionResponse {
  message: string;
  status: 403;
  type: "AuthenticationException";
}

export interface RoleExceptionResponse {
  message: string;
  status: 403;
  type: "RoleException";
}

export interface SkautISAuthorizationExceptionResponse {
  message: string;
  status: 403;
  type: "SkautISAuthorizationException";
}

export interface NotFoundExceptionResponse {
  message: string;
  status: 404;
  type: "NotFoundException";
}

export interface LockedExceptionResponse {
  holder: string;
  message: string;
  status: 409;
  type: "LockedException";
}

export interface NotLockedExceptionResponse {
  message: string;
  status: 412;
  type: "NotLockedException";
}

export type APIErrorResponse =
  | AuthenticationExceptionResponse
  | Error401Response
  | LockedExceptionResponse
  | NotFoundExceptionResponse
  | NotLockedExceptionResponse
  | RoleExceptionResponse
  | SkautISAuthorizationExceptionResponse;

export type APIResponse<T extends RequestResponse> =
  | APIErrorResponse
  | APISuccessResponse<T>;
