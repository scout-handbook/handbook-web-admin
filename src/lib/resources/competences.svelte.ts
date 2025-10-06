import type { Competence } from "$lib/interfaces/Competence";

import { queryClient } from "$lib/utils/queryClient";
import { Resource } from "$lib/utils/Resource.svelte";
import { createQuery } from "@tanstack/svelte-query";

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

export const competences = new Resource<Competence>(
  createQuery<Record<string, Competence>>(
    () => ({
      queryKey: ["v1.0", "competence"],
    }),
    () => queryClient,
  ),
  competenceComparator,
);
