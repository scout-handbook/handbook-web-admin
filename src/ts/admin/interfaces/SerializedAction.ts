import type { ActionCallback } from "../actions/ActionCallback";
import type { Payload } from "./Payload";

export interface SerializedAction {
  callbacks: Array<ActionCallback>;
  method: string;
  payload: Payload;
  url: string;
}
