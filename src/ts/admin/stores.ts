import { readable, writable } from "svelte/store";

import { Config } from "./interfaces/ConfigV2";
import { Loginstate } from "./interfaces/Loginstate";

export const config = readable<Config>(CONFIG);

export const loginstate = writable<Promise<Loginstate>>(new Promise(() => {}));

export const loadingIndicatorVisible = writable<boolean>(false);
