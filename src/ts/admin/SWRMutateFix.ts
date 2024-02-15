// TODO: Remove this when ConsoleTVs/sswr#42 is fixed and released
export type SWRMutateFix<D> = D | null;

// eslint-disable-next-line @typescript-eslint/naming-convention -- Abbreviation
export function SWRMutateFnWrapper<D>(fn: (state: D) => D) {
  return (state: D | null): D | null => {
    if (state === null) {
      return null;
    }
    return fn(state);
  };
}
