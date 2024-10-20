import { createDefaultSWR } from "sswr";

import type { Competence } from "./interfaces/Competence";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";
import type { RequestResponse } from "./interfaces/RequestResponse";

import { get, map, sort } from "./utils/arrayUtils";
import { reAuth, request } from "./utils/request";

export function setupSWR(): void {
  createDefaultSWR({
    dedupingInterval: 60000,
    fetcher: async (url: string): Promise<RequestResponse> =>
      request(
        url,
        "GET",
        {},
        {
          401: reAuth,
          AuthenticationException: reAuth,
          RoleException: (): void => {
            window.location.replace(CONFIG["frontend-uri"]);
          },
        },
      ),
  });
}

function competenceComparator(first: Competence, second: Competence): number {
  const numberComparison =
    parseInt(first.number, 10) - parseInt(second.number, 10);
  return numberComparison !== 0
    ? numberComparison
    : first.number.localeCompare(second.number);
}

function lessonComparator(
  first: Lesson,
  second: Lesson,
  competences: Array<[string, Competence]>,
): number {
  const firstCompetence = get(competences, first.competences[0]);
  const secondCompetence = get(competences, second.competences[0]);
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

function fieldComparator(
  first: Field,
  second: Field,
  lessons: Array<[string, Lesson]>,
  competences: Array<[string, Competence]>,
): number {
  const firstFirstLesson = get(lessons, first.lessons[0]);
  const secondFirstLesson = get(lessons, second.lessons[0]);
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

export function processCompetences(
  rawCompetences: Record<string, Competence>,
): Array<[string, Competence]> {
  return sort(Object.entries(rawCompetences), competenceComparator);
}

export function processFields(
  rawFields: Record<string, Field>,
  lessons: Array<[string, Lesson]>,
  competences: Array<[string, Competence]>,
): Array<[string, Field]> {
  const fields = map(Object.entries(rawFields), (field) => {
    field.lessons.sort((first: string, second: string): number => {
      const firstLesson = get(lessons, first);
      const secondLesson = get(lessons, second);
      if (firstLesson === undefined || secondLesson === undefined) {
        return 0;
      }
      return lessonComparator(firstLesson, secondLesson, competences);
    });
    return field;
  });
  return sort(fields, (first, second) =>
    fieldComparator(first, second, lessons, competences),
  );
}

export function processGroups(
  rawGroups: Record<string, Group>,
): Array<[string, Group]> {
  return sort(Object.entries(rawGroups), (first, second) =>
    first.name.localeCompare(second.name),
  );
}

export function processLessons(
  rawLessons: Record<string, Lesson>,
  competences: Array<[string, Competence]>,
): Array<[string, Lesson]> {
  const lessons = map(Object.entries(rawLessons), (lesson) => {
    lesson.competences.sort((first: string, second: string): number => {
      const firstCompetence = get(competences, first);
      const secondCompetence = get(competences, second);
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
    });
    return lesson;
  });
  return sort(lessons, (first, second) =>
    lessonComparator(first, second, competences),
  );
}
