import { readable, writable } from "svelte/store";

import type { IDList } from "./IDList";
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

export const fields = writable<IDList<Field> | null>(null);
export const competences = writable<IDList<Competence> | null>(null);
export const groups = writable<IDList<Group> | null>(null);
export const lessons = writable<IDList<Lesson> | null>(null);

export const globalLoadingIndicator = writable<boolean>(false);
export const globalDialogMessage = writable<string | null>(null);
