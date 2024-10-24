import type { ActionCallback } from "$lib/actions/ActionCallback";
import type { Payload } from "$lib/interfaces/Payload";

export interface SerializedAction {
  callbacks: Array<ActionCallback>;
  method: string;
  payload: Payload;
  url: string;
}
