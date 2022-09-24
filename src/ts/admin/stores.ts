import { readable, writable } from "svelte/store";

export const admin_uri = readable<string>(CONFIG["admin-uri"]);
export const frontend_uri = readable<string>(CONFIG["frontend-uri"]);
export const site_name = readable<string>(CONFIG["site-name"]);

export const loadingIndicatorVisible = writable<boolean>(false);
