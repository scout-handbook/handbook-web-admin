import { navigate } from "svelte-navigator";

import { ActionCallback } from "./ActionCallback";
import { ActionQueue, ActionQueueRetry } from "./ActionQueue";
import { dialog } from "../UI/dialog";
import { dismissSpinner } from "../UI/spinner";
import { ExceptionHandler } from "../interfaces/ExceptionHandler";
import { Payload } from "../interfaces/Payload";
import { refreshMetadata } from "../metadata";
import { RequestResponse } from "../interfaces/RequestResponse";
import { SerializedAction } from "../interfaces/SerializedAction";

export class Action {
  public url: string;
  public method: string;
  public payloadBuilder: () => Payload;
  public callbacks: Array<ActionCallback>;
  public exceptionHandler: ExceptionHandler;

  public constructor(
    url: string,
    method: string,
    payloadBuilder: () => Payload = function (): Payload {
      return {};
    },
    callbacks: Array<ActionCallback> = [],
    exceptionHandler: ExceptionHandler = {}
  ) {
    this.url = url;
    this.method = method;
    this.payloadBuilder = payloadBuilder;
    this.callbacks = callbacks;
    this.exceptionHandler = exceptionHandler;
  }

  public callback(response: RequestResponse, actionQueue: ActionQueue): void {
    for (let i = 0; i < this.callbacks.length; i++) {
      switch (this.callbacks[i]) {
        case ActionCallback.DialogConfirm:
          this.dialogConfirm();
          break;
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

  public dialogConfirm(): void {
    dialog("Akce byla úspěšná.", "OK");
    refreshMetadata();
    if (ActionQueueRetry) {
      navigate("/admin/");
    } else {
      history.back();
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
    payload: action.payloadBuilder(),
    callbacks: action.callbacks,
  };
}

export function deserializeAction(action: SerializedAction): Action {
  return new Action(
    action.url,
    action.method,
    function (): Payload {
      return action.payload;
    },
    action.callbacks,
    undefined
  );
}
