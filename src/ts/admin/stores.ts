import { readable, writable } from "svelte/store";

import type { Competence } from "./interfaces/Competence";
import type { ConfigCustomProperties } from "./interfaces/Config";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";

export const adminUri = readable<string>(CONFIG["admin-uri"]);
export const apiUri = readable<string>(CONFIG["api-uri"]);
export const customProperties = readable<ConfigCustomProperties>(
  CONFIG["custom-properties"]
);
export const frontendUri = readable<string>(CONFIG["frontend-uri"]);
export const siteName = readable<string>(CONFIG["site-name"]);

export const fields = writable<Array<[string, Field]> | null>(null);
export const competences = writable<Array<[string, Competence]> | null>(null);
export const groups = writable<Array<[string, Group]> | null>(null);
export const lessons = writable<Array<[string, Lesson]> | null>(null);

export const globalLoadingIndicator = writable<boolean>(false);
export const globalDialogMessage = writable<string | null>(null);
