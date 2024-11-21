import type { Competence } from "$lib/interfaces/Competence";
import type { Field } from "$lib/interfaces/Field";
import type { Lesson } from "$lib/interfaces/Lesson";

import { lessonComparator } from "$lib/resources/lessons";
import { queryClient } from "$lib/utils/queryClient";
import { createQuery } from "@tanstack/svelte-query";
import { SvelteMap } from "svelte/reactivity";
import { derived, fromStore } from "svelte/store";

export const fields = fromStore(
  derived(
    createQuery<Record<string, Field>>(
      {
        queryKey: ["v1.0", "field", { "override-group": true }],
      },
      queryClient,
    ),
    ({ data, isSuccess }) =>
      isSuccess
        ? new SvelteMap<string, Field>(Object.entries(data))
        : undefined,
    undefined,
  ),
);

export function sortFields(
  unsortedFields: SvelteMap<string, Field>,
  unsortedLessons: SvelteMap<string, Lesson>,
  unsortedCompetences: SvelteMap<string, Competence>,
): SvelteMap<string, Field> {
  return new SvelteMap(
    [...unsortedFields].sort((first, second) =>
      fieldComparator(
        first[1],
        second[1],
        unsortedLessons,
        unsortedCompetences,
      ),
    ),
  );
}

function fieldComparator(
  first: Field,
  second: Field,
  lessons: SvelteMap<string, Lesson>,
  competences: SvelteMap<string, Competence>,
): number {
  const firstFirstLesson = lessons.get(first.lessons[0]);
  const secondFirstLesson = lessons.get(second.lessons[0]);
  if (firstFirstLesson === undefined) {
    if (secondFirstLesson === undefined) {
      return 0;
    }
    return 1;
  }
  if (secondFirstLesson === undefined) {
    return -1;
  }
  return lessonComparator(firstFirstLesson, secondFirstLesson, competences);
}
