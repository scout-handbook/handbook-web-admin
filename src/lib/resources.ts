import { createContext } from "svelte";

import type { Competence } from "#lib/interfaces/Competence.js";
import type { Field } from "#lib/interfaces/Field.js";
import type { Group } from "#lib/interfaces/Group.js";
import type { Lesson } from "#lib/interfaces/Lesson.js";
import type { Resource } from "#lib/utils/Resource.svelte.js";

export function competenceComparator(
  first: Competence,
  second: Competence,
): number {
  const numberComparison =
    parseInt(first.number, 10) - parseInt(second.number, 10);
  return numberComparison === 0
    ? first.number.localeCompare(second.number)
    : numberComparison;
}

export function fieldComparator(
  first: Field,
  second: Field,
  competences: Resource<Competence>,
  lessons: Resource<Lesson>,
): number {
  const firstFirstLesson = lessons.current?.get(first.lessons[0]);
  const secondFirstLesson = lessons.current?.get(second.lessons[0]);
  return firstFirstLesson === undefined
    ? secondFirstLesson === undefined
      ? 0
      : 1
    : secondFirstLesson === undefined
      ? -1
      : lessonComparator(firstFirstLesson, secondFirstLesson, competences);
}

export function groupComparator(first: Group, second: Group): number {
  return first.name.localeCompare(second.name);
}

export function lessonComparator(
  first: Lesson,
  second: Lesson,
  competences: Resource<Competence>,
): number {
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

export const [getResourceContext, setResourceContext] = createContext<{
  competences: Resource<Competence>;
  fields: Resource<Field>;
  groups: Resource<Group>;
  lessons: Resource<Lesson>;
}>();
