import { readable, writable } from "svelte/store";

export const adminUri = readable<string>(CONFIG["admin-uri"]);
export const apiUri = readable<string>(CONFIG["api-uri"]);
export const frontendUri = readable<string>(CONFIG["frontend-uri"]);
export const siteName = readable<string>(CONFIG["site-name"]);

export const suspendReAuth = writable<boolean>(false);
export const globalLoadingIndicator = writable<boolean>(false);
export const globalDialogMessage = writable<string | null>(null);
