import { ActionCallback } from "../tools/ActionCallback";
import { Payload } from "./Payload";

export interface SerializedAction {
  url: string;
  method: string;
  payload: Payload;
  callbacks: Array<ActionCallback>;
}
