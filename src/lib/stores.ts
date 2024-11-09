import { readable, writable } from "svelte/store";

export const siteName = readable<string>(CONFIG["site-name"]);

export const suspendReAuth = writable<boolean>(false);
export const afterReAuthAction = writable<(() => void) | null>(null);
export const globalLoadingIndicator = writable<boolean>(false);
export const globalDialogMessage = writable<string | null>(null);
