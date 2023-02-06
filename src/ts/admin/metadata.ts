import type { Competence } from "./interfaces/Competence";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";
import { get, map, sort } from "./tools/arrayTools";

function competenceComparator(first: Competence, second: Competence): number {
  return first.number - second.number;
}

function lessonComparator(
  first: Lesson,
  second: Lesson,
  competences: Array<[string, Competence]>
): number {
  if (first.competences.length === 0) {
    if (second.competences.length === 0) {
      return 0;
    }
    return 1;
  }
  if (second.competences.length === 0) {
    return -1;
  }
  return competenceComparator(
    get(competences, first.competences[0])!,
    get(competences, second.competences[0])!
  );
}

function fieldComparator(
  first: Field,
  second: Field,
  lessons: Array<[string, Lesson]>,
  competences: Array<[string, Competence]>
): number {
  if (first.lessons.length === 0) {
    if (second.lessons.length === 0) {
      return 0;
    }
    return 1;
  }
  if (second.lessons.length === 0) {
    return -1;
  }
  return lessonComparator(
    get(lessons, first.lessons[0])!,
    get(lessons, second.lessons[0])!,
    competences
  );
}

export function processCompetences(
  rawCompetences: Record<string, Competence> | undefined
): Array<[string, Competence]> | undefined {
  if (rawCompetences === undefined) {
    return undefined;
  }
  return sort(Object.entries(rawCompetences), competenceComparator);
}

export function processFields(
  values: [
    Record<string, Field> | undefined,
    Array<[string, Lesson]> | undefined,
    Array<[string, Competence]> | undefined
  ]
): Array<[string, Field]> | undefined {
  const [rawFields, lessons, competences] = values;
  if (
    rawFields === undefined ||
    lessons === undefined ||
    competences === undefined
  ) {
    return undefined;
  }
  const fields = map(Object.entries(rawFields), (field) => {
    field.lessons.sort((first: string, second: string): number =>
      lessonComparator(get(lessons, first)!, get(lessons, second)!, competences)
    );
    return field;
  });
  return sort(fields, (first, second) =>
    fieldComparator(first, second, lessons, competences)
  );
}

export function processGroups(
  rawGroups: Record<string, Group> | undefined
): Array<[string, Group]> | undefined {
  if (rawGroups === undefined) {
    return undefined;
  }
  return sort(Object.entries(rawGroups), (first, second) =>
    first.name.localeCompare(second.name)
  );
}

export function processLessons(
  values: [
    Record<string, Lesson> | undefined,
    Array<[string, Competence]> | undefined
  ]
): Array<[string, Lesson]> | undefined {
  const [rawLessons, competences] = values;
  if (rawLessons === undefined || competences === undefined) {
    return undefined;
  }
  const lessons = map(Object.entries(rawLessons), (lesson) => {
    lesson.competences.sort((first: string, second: string): number =>
      competenceComparator(get(competences, first)!, get(competences, second)!)
    );
    return lesson;
  });
  return sort(lessons, (first, second) =>
    lessonComparator(first, second, competences)
  );
}
