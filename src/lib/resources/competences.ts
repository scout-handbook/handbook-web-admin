import type { Competence } from "$lib/interfaces/Competence";

import { queryClient } from "$lib/utils/queryClient";
import { createQuery } from "@tanstack/svelte-query";
import { SvelteMap } from "svelte/reactivity";
import { derived } from "svelte/store";

export const competences = derived(
  createQuery<Record<string, Competence>>(
    {
      queryKey: ["v1.0", "competence"],
    },
    queryClient,
  ),
  ({ data, isSuccess }) =>
    isSuccess
      ? new SvelteMap<string, Competence>(Object.entries(data))
      : undefined,
  undefined,
);

export function competenceComparator(
  first: Competence,
  second: Competence,
): number {
  const numberComparison =
    parseInt(first.number, 10) - parseInt(second.number, 10);
  return numberComparison !== 0
    ? numberComparison
    : first.number.localeCompare(second.number);
}

export function sortCompetences(
  unsortedCompetences: SvelteMap<string, Competence>,
): SvelteMap<string, Competence> {
  return new SvelteMap(
    [...unsortedCompetences].sort((first, second) =>
      competenceComparator(first[1], second[1]),
    ),
  );
}
