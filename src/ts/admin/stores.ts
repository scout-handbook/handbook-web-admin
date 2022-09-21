import { readable } from "svelte/store";

export const admin_uri = readable(CONFIG["admin-uri"]);
export const frontend_uri = readable(CONFIG["frontend-uri"]);
export const site_name = readable(CONFIG["site-name"]);
