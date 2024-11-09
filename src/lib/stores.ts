import { writable } from "svelte/store";

export const afterReAuthAction = writable<(() => void) | null>(null);
export const globalLoadingIndicator = writable<boolean>(false);
export const globalDialogMessage = writable<string | null>(null);
