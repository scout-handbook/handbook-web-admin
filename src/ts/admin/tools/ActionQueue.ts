import { revalidate } from "sswr";

import type { SerializedAction } from "../interfaces/SerializedAction";
import { globalDialogMessage, globalLoadingIndicator } from "../stores";
import { request } from "../tools/request";
import type { Action } from "./Action";
import { deserializeAction, serializeAction } from "./Action";
import { constructURL } from "./constructURL";

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
    return new Promise((resolve) => {
      this.pop(resolve, true);
    });
  }

  private pop(resolve: () => void, propagate: boolean): void {
    if (this.actions.length <= 1) {
      propagate = false;
    }
    this.actions[0].exceptionHandler["AuthenticationException"] = (): void => {
      this.authException();
    };
    void request(
      this.actions[0].url,
      this.actions[0].method,
      this.actions[0].payload,
      this.actions[0].exceptionHandler
    ).then((response) => {
      this.actions[0].callback(response, this);
      this.actions.shift();
      if (propagate) {
        this.pop(resolve, true);
      } else {
        resolve();
      }
    });
  }

  private authException(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (!this.isRetryAfterLogin && window.sessionStorage) {
      sessionStorage.setItem(
        "ActionQueue",
        JSON.stringify(this.actions.map(serializeAction))
      );
      window.location.replace(
        CONFIG["api-uri"] + "/v1.0/login?return-uri=" + window.location.pathname
      );
    } else {
      globalDialogMessage.set(
        "Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu."
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
          sessionStorage.getItem("ActionQueue")!
        ) as Array<SerializedAction>
      ).map(deserializeAction),
      true
    );
    sessionStorage.clear();
    globalLoadingIndicator.set(true);
    void aq.dispatch().then(() => {
      revalidate(constructURL("v1.0/competence"), { force: true });
      revalidate(constructURL("v1.0/lesson?override-group=true"), {
        force: true,
      });
      revalidate(constructURL("v1.0/field?override-group=true"), {
        force: true,
      });
      revalidate(constructURL("v1.0/group"), { force: true });
      globalLoadingIndicator.set(false);
      globalDialogMessage.set("Akce byla úspěšná");
    });
  }
}
