import type { RequestResponse } from "./RequestResponse";

export interface APISuccessResponse<T extends RequestResponse> {
  response: T;
  status: 200 | 201;
}

export type APIErrorResponse =
  | {
      holder: string;
      message: string;
      status: 409;
      type: string;
    }
  | {
      message: string;
      status: 400 | 403 | 404 | 412 | 415 | 500;
      type: string;
    }
  | {
      status: 401;
    };

export type APIResponse<T extends RequestResponse> =
  | APIErrorResponse
  | APISuccessResponse<T>;
