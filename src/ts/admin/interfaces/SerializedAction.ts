import type { ActionCallback } from "../tools/ActionCallback";
import type { Payload } from "./Payload";

export interface SerializedAction {
  url: string;
  method: string;
  payload: Payload;
  callbacks: Array<ActionCallback>;
}
