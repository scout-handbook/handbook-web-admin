import { readable, writable } from "svelte/store";

import { Competence } from "./interfaces/Competence";
import { ConfigCustomProperties } from "./interfaces/ConfigV2";
import { Field } from "./interfaces/Field";
import { Group } from "./interfaces/Group";
import { IDList } from "./IDList";
import { Lesson } from "./interfaces/Lesson";
import { Loginstate } from "./interfaces/Loginstate";

export const adminUri = readable<string>(CONFIG["admin-uri"]);
export const apiUri = readable<string>(CONFIG["api-uri"]);
export const customProperties = readable<ConfigCustomProperties>(
  CONFIG["custom-properties"] as ConfigCustomProperties
);
export const frontendUri = readable<string>(CONFIG["frontend-uri"]);
export const siteName = readable<string>(CONFIG["site-name"]);

export const fields = writable<IDList<Field> | null>(null);
export const competences = writable<IDList<Competence> | null>(null);
export const groups = writable<IDList<Group> | null>(null);
export const lessons = writable<IDList<Lesson> | null>(null);
export const loginstate = writable<Loginstate | null>(null);

export const loadingIndicatorVisible = writable<boolean>(false);
