import { readable, writable } from "svelte/store";

import { Competence } from "./interfaces/Competence";
import { Config } from "./interfaces/ConfigV2";
import { Field } from "./interfaces/Field";
import { Group } from "./interfaces/Group";
import { IDList } from "./IDList";
import { Lesson } from "./interfaces/Lesson";
import { Loginstate } from "./interfaces/Loginstate";

export const config = readable<Config>(CONFIG);

export const fields = writable<Promise<IDList<Field>>>(new Promise(() => {}));
export const competences = writable<Promise<IDList<Competence>>>(
  new Promise(() => {})
);
export const groups = writable<Promise<IDList<Group>>>(new Promise(() => {}));
export const lessons = writable<Promise<IDList<Lesson>>>(new Promise(() => {}));
export const loginstate = writable<Promise<Loginstate>>(new Promise(() => {}));

export const loadingIndicatorVisible = writable<boolean>(false);
