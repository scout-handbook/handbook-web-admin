import { clear } from "sswr";

import type { SerializedAction } from "../interfaces/SerializedAction";
import { globalDialogMessage, globalLoadingIndicator } from "../stores";
import { request } from "../utils/request";
import type { Action } from "./Action";
import { deserializeAction, serializeAction } from "./Action";

export class ActionQueue {
  public actions: Array<Action>;
  private readonly isRetryAfterLogin: boolean;

  public constructor(actions: Array<Action> = [], isRetryAfterLogin = false) {
    this.actions = actions;
    this.isRetryAfterLogin = isRetryAfterLogin;
  }

  public fillID(id: string): void {
    for (const action of this.actions) {
      action.fillID(id);
    }
  }

  public async dispatch(): Promise<void> {
    if (this.actions.length == 0) {
      return new Promise((resolve) => {
        resolve();
      });
    }
    return new Promise((resolve, reject) => {
      this.pop(resolve, reject);
    });
  }

  private pop(resolve: () => void, reject: () => void): void {
    this.actions[0].exceptionHandler.AuthenticationException = (): void => {
      this.authException();
    };
    request(
      this.actions[0].url,
      this.actions[0].method,
      this.actions[0].payload,
      this.actions[0].exceptionHandler,
    )
      .then((response) => {
        this.actions[0].callback(response, this);
        this.actions.shift();
        if (this.actions.length > 0) {
          this.pop(resolve, reject);
        } else {
          resolve();
        }
      })
      .catch(reject);
  }

  private authException(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (!this.isRetryAfterLogin && window.sessionStorage) {
      sessionStorage.setItem(
        "ActionQueue",
        JSON.stringify(this.actions.map(serializeAction)),
      );
      window.location.replace(
        CONFIG["api-uri"] +
          "/v1.0/login?return-uri=" +
          window.location.pathname,
      );
    } else {
      globalDialogMessage.set(
        "Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.",
      );
    }
  }
}

export function ActionQueueSetup(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  if (window.sessionStorage && sessionStorage.getItem("ActionQueue") !== null) {
    const aq = new ActionQueue(
      (
        JSON.parse(
          sessionStorage.getItem("ActionQueue")!,
        ) as Array<SerializedAction>
      ).map(deserializeAction),
      true,
    );
    sessionStorage.clear();
    globalLoadingIndicator.set(true);
    void aq.dispatch().then(() => {
      clear(undefined, { broadcast: true });
      globalLoadingIndicator.set(false);
      globalDialogMessage.set("Akce byla úspěšná");
    });
  }
}
