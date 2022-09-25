import { readable, writable } from "svelte/store";

import { Config } from "./interfaces/ConfigV2";

export const config = readable<Config>(CONFIG);

export const loadingIndicatorVisible = writable<boolean>(false);
