import type { Field } from "$lib/interfaces/Field";

import { lessonComparator, lessons } from "$lib/resources/lessons.svelte";
import { queryClient } from "$lib/utils/queryClient";
import { Resource } from "$lib/utils/Resource.svelte";
import { createQuery } from "@tanstack/svelte-query";

function fieldComparator(first: Field, second: Field): number {
  const firstFirstLesson = lessons.current?.get(first.lessons[0]);
  const secondFirstLesson = lessons.current?.get(second.lessons[0]);
  return firstFirstLesson === undefined
    ? secondFirstLesson === undefined
      ? 0
      : 1
    : secondFirstLesson === undefined
      ? -1
      : lessonComparator(firstFirstLesson, secondFirstLesson);
}

export const fields = new Resource<Field>(
  createQuery<Record<string, Field>>(
    () => ({
      queryKey: ["v1.0", "field", { "override-group": true }],
    }),
    () => queryClient,
  ),
  fieldComparator,
);
