import type { RequestResponse } from "./RequestResponse";

export interface APIResponse {
  status: number;
  response?: RequestResponse;
  type?: string;
  message?: string;
  holder?: string;
}
