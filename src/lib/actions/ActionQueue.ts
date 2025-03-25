import type { SerializedAction } from "$lib/interfaces/SerializedAction";

import { goto } from "$app/navigation";
import { base } from "$app/paths";
import {
  type Action,
  deserializeAction,
  serializeAction,
} from "$lib/actions/Action";
import { globalUI } from "$lib/globalUI.svelte";
import { queryClient } from "$lib/utils/queryClient";
import { request } from "$lib/utils/request";

export class ActionQueue {
  public actions: Array<Action>;
  private readonly isRetryAfterLogin: boolean;

  public constructor(actions: Array<Action> = [], isRetryAfterLogin = false) {
    this.actions = actions;
    this.isRetryAfterLogin = isRetryAfterLogin;
  }

  public async dispatch(): Promise<void> {
    if (this.actions.length < 1) {
      localStorage.removeItem("ActionQueue");
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

  public fillID(id: string): void {
    for (const action of this.actions) {
      action.fillID(id);
    }
  }

  private authException(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- window.localStorage is not present in older browsers
    if (!this.isRetryAfterLogin && window.localStorage) {
      window.location.replace(
        `${CONFIG["api-uri"]}/v1.0/login?return-uri=${window.location.pathname}`,
      );
    } else {
      globalUI.dialogMessage =
        "Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.";
    }
  }
}

export function setupActionQueue(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- window.localStorage is not present in older browsers
  if (!window.localStorage) {
    return;
  }
  const serializedQueue = localStorage.getItem("ActionQueue");
  if (serializedQueue === null) {
    return;
  }
  const aq = new ActionQueue(
    (JSON.parse(serializedQueue) as Array<SerializedAction>).map(
      deserializeAction,
    ),
    true,
  );
  globalUI.loadingIndicator = true;
  void aq
    .dispatch()
    .then(() => {
      void queryClient.invalidateQueries();
      void goto(`${base}/${CONFIG["admin-uri"].split("/").slice(3).join("/")}`);
      globalUI.loadingIndicator = false;
      globalUI.dialogMessage = "Akce byla úspěšná";
    })
    .catch(() => {
      const currentQueue = localStorage.getItem("ActionQueue");
      if (currentQueue !== null) {
        localStorage.setItem("ActionQueue-backup", currentQueue);
        localStorage.removeItem("ActionQueue");
      }
    });
}
