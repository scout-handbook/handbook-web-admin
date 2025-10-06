import type { Lesson } from "$lib/interfaces/Lesson";

import {
  competenceComparator,
  competences,
} from "$lib/resources/competences.svelte";
import { queryClient } from "$lib/utils/queryClient";
import { Resource } from "$lib/utils/Resource.svelte";
import { createQuery } from "@tanstack/svelte-query";

export function lessonComparator(first: Lesson, second: Lesson): number {
  const firstCompetence = competences.current?.get(first.competences[0]);
  const secondCompetence = competences.current?.get(second.competences[0]);
  return firstCompetence === undefined
    ? secondCompetence === undefined
      ? 0
      : 1
    : secondCompetence === undefined
      ? -1
      : competenceComparator(firstCompetence, secondCompetence);
}

export const lessons = new Resource<Lesson>(
  createQuery<Record<string, Lesson>>(
    () => ({
      queryKey: ["v1.0", "lesson", { "override-group": true }],
    }),
    () => queryClient,
  ),
  lessonComparator,
);
