import { Action } from "./Action";
import { ActionCallback } from "./ActionCallback";
import { deserializeAction, serializeAction } from "./Action";
import { dialog } from "../UI/dialog";
import { request } from "../tools/request";
import { SerializedAction } from "../interfaces/SerializedAction";
import { spinner } from "../UI/spinner";

export let ActionQueueRetry = false;

export class ActionQueue {
  public actions: Array<Action>;

  public constructor(actions: Array<Action> = [], retry = false) {
    this.actions = actions;
    ActionQueueRetry = retry;
  }

  public fillID(id: string): void {
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].fillID(id);
    }
  }

  public dispatch(background: boolean): void {
    if (this.actions.length > 0) {
      this.pop(true, background);
    }
  }

  public defaultDispatch(background: boolean): void {
    this.addDefaultCallback();
    this.dispatch(background);
  }

  private addDefaultCallback(): void {
    this.actions[this.actions.length - 1].callbacks.push(
      ActionCallback.DialogConfirm
    );
  }

  private pop(propagate: boolean, background: boolean): void {
    if (this.actions.length <= 1) {
      propagate = false;
    }
    if (!background) {
      spinner();
    }
    this.actions[0].exceptionHandler["AuthenticationException"] = (): void =>
      this.authException();
    request(
      this.actions[0].url,
      this.actions[0].method,
      this.actions[0].payloadBuilder(),
      (response) => {
        this.actions[0].callback(response, this);
        this.actions.shift();
        if (propagate) {
          this.pop(true, background);
        }
      },
      this.actions[0].exceptionHandler
    );
  }

  private authException(): void {
    if (!ActionQueueRetry && window.sessionStorage) {
      sessionStorage.setItem(
        "ActionQueue",
        JSON.stringify(this.actions.map(serializeAction))
      );
      window.location.replace(
        CONFIG["api-uri"] + "/v1.0/login?return-uri=" + window.location.pathname
      );
    } else {
      dialog(
        "Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.",
        "OK"
      );
    }
  }
}

export function ActionQueueSetup(): void {
  if (window.sessionStorage && sessionStorage.getItem("ActionQueue")) {
    const aq = new ActionQueue(
      (
        JSON.parse(
          sessionStorage.getItem("ActionQueue")!
        ) as Array<SerializedAction>
      ).map(deserializeAction),
      false
    );
    ActionQueueRetry = true;
    sessionStorage.clear();
    aq.dispatch(false);
  }
}
