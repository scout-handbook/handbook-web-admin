import { ExceptionHandler } from "../interfaces/ExceptionHandler";
import { Payload } from "../interfaces/Payload";
import { RequestResponse } from "../interfaces/RequestResponse";
import { SerializedAction } from "../interfaces/SerializedAction";
import { dismissSpinner } from "../UI/spinner";
import { ActionCallback } from "./ActionCallback";
import { ActionQueue, ActionQueueRetry } from "./ActionQueue";

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
    exceptionHandler: ExceptionHandler = {}
  ) {
    this.url = url;
    this.method = method;
    this.payload = payload;
    this.callbacks = callbacks;
    this.exceptionHandler = exceptionHandler;
  }

  public callback(response: RequestResponse, actionQueue: ActionQueue): void {
    for (let i = 0; i < this.callbacks.length; i++) {
      switch (this.callbacks[i]) {
        case ActionCallback.DismissSpinner:
          dismissSpinner();
          break;
        case ActionCallback.FillID:
          actionQueue.fillID(response as string);
          break;
        case ActionCallback.RemoveBeacon:
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
    undefined
  );
}
