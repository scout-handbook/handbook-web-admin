import type { SerializedAction } from "$lib/interfaces/SerializedAction";

import { goto } from "$app/navigation";
import { base } from "$app/paths";
import {
  type Action,
  deserializeAction,
  serializeAction,
} from "$lib/actions/Action";
import {
  adminUri,
  globalDialogMessage,
  globalLoadingIndicator,
} from "$lib/stores";
import { queryClient } from "$lib/utils/queryClient";
import { request } from "$lib/utils/request";
import { get } from "svelte/store";

export class ActionQueue {
  private readonly isRetryAfterLogin: boolean;
  public actions: Array<Action>;

  public constructor(actions: Array<Action> = [], isRetryAfterLogin = false) {
    this.actions = actions;
    this.isRetryAfterLogin = isRetryAfterLogin;
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

  public fillID(id: string): void {
    for (const action of this.actions) {
      action.fillID(id);
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
  globalLoadingIndicator.set(true);
  void aq.dispatch().then(() => {
    void queryClient.invalidateQueries();
    void goto(`${base}/${get(adminUri).split("/").slice(3).join("/")}`);
    globalLoadingIndicator.set(false);
    globalDialogMessage.set("Akce byla úspěšná");
  });
}
