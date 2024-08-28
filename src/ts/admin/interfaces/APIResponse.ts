import type { RequestResponse } from "./RequestResponse";

export interface APIResponse<T extends RequestResponse> {
  holder?: string;
  message?: string;
  response?: T;
  status: number;
  type?: string;
}
