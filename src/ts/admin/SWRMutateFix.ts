// TODO: Remove this when ConsoleTVs/sswr#42 is fixed and released
export type SWRMutateFix<D> = D | null;

export function SWRMutateFnWrapper<D>(fn: (state: D) => D) {
  return (state: D | null): D | null => {
    if (state === null) {
      return null;
    }
    return fn(state);
  };
}
