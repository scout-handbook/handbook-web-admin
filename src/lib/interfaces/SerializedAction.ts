import type { ActionCallback } from "$lib/actions/ActionCallback";
import type { Payload } from "$lib/interfaces/Payload";

export interface SerializedAction {
  url: string;
  method: string;
  payload: Payload;
  callbacks: Array<ActionCallback>;
}
