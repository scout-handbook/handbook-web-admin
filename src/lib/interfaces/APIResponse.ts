import type { RequestResponse } from "$lib/interfaces/RequestResponse";

export interface APIResponse<T extends RequestResponse> {
  status: number;
  response?: T;
  type?: string;
  message?: string;
  holder?: string;
}
