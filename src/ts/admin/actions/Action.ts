import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { Payload } from "../interfaces/Payload";
import type { RequestResponse } from "../interfaces/RequestResponse";
import type { SerializedAction } from "../interfaces/SerializedAction";
import type { ActionQueue } from "./ActionQueue";

import { ActionCallback } from "./ActionCallback";

export class Action {
  public url: string;
  public method: string;
  public payload: Payload;
  public callbacks: Array<ActionCallback>;
  public exceptionHandler: ExceptionHandler;

  public constructor(
    url: string,
    method: string,
    payload: Payload = {},
    callbacks: Array<ActionCallback> = [],
    exceptionHandler: ExceptionHandler = {},
  ) {
    this.url = url;
    this.method = method;
    this.payload = payload;
    this.callbacks = callbacks;
    this.exceptionHandler = exceptionHandler;
  }

  public callback(response: RequestResponse, actionQueue: ActionQueue): void {
    for (const callback of this.callbacks) {
      switch (callback) {
        case ActionCallback.fillID:
          actionQueue.fillID(response as string);
          break;
        case ActionCallback.removeBeacon:
          window.onbeforeunload = null;
          break;
      }
    }
  }

  public fillID(id: string): void {
    this.url = this.url.replace("{id}", encodeURIComponent(id));
  }
}

export function serializeAction(action: Action): SerializedAction {
  return {
    url: action.url,
    method: action.method,
    payload: action.payload,
    callbacks: action.callbacks,
  };
}

export function deserializeAction(action: SerializedAction): Action {
  return new Action(
    action.url,
    action.method,
    action.payload,
    action.callbacks,
    undefined,
  );
}
