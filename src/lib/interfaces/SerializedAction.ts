import type { ActionCallback } from "#lib/actions/ActionCallback.js";
import type { Payload } from "#lib/interfaces/Payload.js";

export interface SerializedAction {
  callbacks: Array<ActionCallback>;
  method: string;
  payload: Payload;
  url: string;
}
