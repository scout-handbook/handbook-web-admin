import { clear } from "sswr";
import { get } from "svelte/store";
import { navigate } from "svelte-navigator";

import type { SerializedAction } from "../interfaces/SerializedAction";

import {
  adminUri,
  globalDialogMessage,
  globalLoadingIndicator,
} from "../stores";
import { request } from "../utils/request";
import { type Action, deserializeAction, serializeAction } from "./Action";

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
    if (this.actions.length < 1) {
      localStorage.clear();
      return;
    }
    this.actions[0].exceptionHandler.AuthenticationException = (): void => {
      this.authException();
    };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- window.localStorage is not present in older browsers
    if (window.localStorage) {
      localStorage.setItem(
        "ActionQueue",
        JSON.stringify(this.actions.map(serializeAction)),
      );
    }
    await request(
      this.actions[0].url,
      this.actions[0].method,
      this.actions[0].payload,
      this.actions[0].exceptionHandler,
    ).then(async (response) => {
      this.actions[0].callback(response, this);
      this.actions.shift();
      await this.dispatch();
    });
  }

  private authException(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- window.localStorage is not present in older browsers
    if (!this.isRetryAfterLogin && window.localStorage) {
      window.location.replace(
        `${CONFIG["api-uri"]}/v1.0/login?return-uri=${window.location.pathname}`,
      );
    } else {
      globalDialogMessage.set(
        "Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.",
      );
    }
  }
}

export function setupActionQueue(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- window.localStorage is not present in older browsers
  if (window.localStorage && localStorage.getItem("ActionQueue") !== null) {
    const aq = new ActionQueue(
      (
        JSON.parse(
          localStorage.getItem("ActionQueue")!,
        ) as Array<SerializedAction>
      ).map(deserializeAction),
      true,
    );
    globalLoadingIndicator.set(true);
    void aq.dispatch().then(() => {
      clear(undefined, { broadcast: true });
      navigate(`/${get(adminUri).split("/").slice(3).join("/")}`);
      globalLoadingIndicator.set(false);
      globalDialogMessage.set("Akce byla úspěšná");
    });
  }
}
