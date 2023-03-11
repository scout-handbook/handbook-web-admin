import type { ActionCallback } from "../actions/ActionCallback";
import type { Payload } from "./Payload";

export interface SerializedAction {
  url: string;
  method: string;
  payload: Payload;
  callbacks: Array<ActionCallback>;
}
