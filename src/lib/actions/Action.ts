import type { ActionQueue } from "$lib/actions/ActionQueue";
import type { ExceptionHandler } from "$lib/interfaces/ExceptionHandler";
import type { Payload } from "$lib/interfaces/Payload";
import type { RequestResponse } from "$lib/interfaces/RequestResponse";
import type { SerializedAction } from "$lib/interfaces/SerializedAction";

import { ActionCallback } from "$lib/actions/ActionCallback";

export class Action {
  public callbacks: Array<ActionCallback>;
  public exceptionHandler: ExceptionHandler;
  public method: string;
  public payload: Payload;
  public url: string;

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
        default:
      }
    }
  }

  public fillID(id: string): void {
    this.url = this.url.replace("{id}", encodeURIComponent(id));
  }
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

export function serializeAction(action: Action): SerializedAction {
  return {
    callbacks: action.callbacks,
    method: action.method,
    payload: action.payload,
    url: action.url,
  };
}
