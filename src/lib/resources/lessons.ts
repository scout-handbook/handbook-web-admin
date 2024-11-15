import type { Competence } from "$lib/interfaces/Competence";
import type { Lesson } from "$lib/interfaces/Lesson";

import { competenceComparator } from "$lib/resources/competences";
import { queryClient } from "$lib/utils/queryClient";
import { createQuery } from "@tanstack/svelte-query";
import { SvelteMap } from "svelte/reactivity";
import { derived } from "svelte/store";

export const lessons = derived(
  createQuery<Record<string, Lesson>>(
    {
      queryKey: ["v1.0", "lesson", { "override-group": true }],
    },
    queryClient,
  ),
  ({ data, isSuccess }) =>
    isSuccess ? new SvelteMap<string, Lesson>(Object.entries(data)) : undefined,
  undefined,
);

export function lessonComparator(
  first: Lesson,
  second: Lesson,
  competences: SvelteMap<string, Competence>,
): number {
  const firstCompetence = competences.get(first.competences[0]);
  const secondCompetence = competences.get(second.competences[0]);
  if (firstCompetence === undefined) {
    if (secondCompetence === undefined) {
      return 0;
    }
    return 1;
  }
  if (secondCompetence === undefined) {
    return -1;
  }
  return competenceComparator(firstCompetence, secondCompetence);
}

export function sortLessons(
  unsortedLessons: SvelteMap<string, Lesson>,
  unsortedCompetences: SvelteMap<string, Competence>,
): SvelteMap<string, Lesson> {
  return new SvelteMap(
    [...unsortedLessons].sort((first, second) =>
      lessonComparator(first[1], second[1], unsortedCompetences),
    ),
  );
}
