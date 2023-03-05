// TODO: Remove this when ConsoleTVs/sswr#42 is fixed and released
export type SWRMutateFix<D> = D | ((value: D) => D);
