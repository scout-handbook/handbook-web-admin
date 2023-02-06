import type { Competence } from "./interfaces/Competence";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";
import type { Loginstate } from "./interfaces/Loginstate";
import { globalDialogMessage, groups } from "./stores";
import { get, map, sort } from "./tools/arrayTools";
import { rawRequest, request } from "./tools/request";

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

function processGroups(
  rawGroups: Record<string, Group>
): Array<[string, Group]> {
  return sort(Object.entries(rawGroups), (first, second) =>
    first.name.localeCompare(second.name)
  );
}

export function refreshMetadata(): void {
  const groupExceptionHandler = {
    AuthenticationException: function (): void {
      window.location.href =
        CONFIG["api-uri"] +
        "/v1.0/login?return-uri=" +
        encodeURIComponent(window.location.href);
    },
    RoleException: function (): void {
      window.location.replace(CONFIG["frontend-uri"]);
    },
  };
  void request<Record<string, Group>>(
    CONFIG["api-uri"] + "/v1.0/group",
    "GET",
    {},
    groupExceptionHandler
  ).then((response) => {
    groups.set(processGroups(response));
  });
  void rawRequest<Loginstate>(
    CONFIG["api-uri"] + "/v1.0/account",
    "GET",
    undefined
  ).then((response) => {
    if (response.status === 200) {
      if (
        ["editor", "administrator", "superuser"].includes(
          response.response!.role
        )
      ) {
        // TODO: Do these checks on every request?
      } else {
        window.location.replace(CONFIG["frontend-uri"]);
      }
    } else if (response.status === 401) {
      window.location.href =
        CONFIG["api-uri"] +
        "/v1.0/login?return-uri=" +
        encodeURIComponent(window.location.href);
    } else {
      globalDialogMessage.set(
        "Nastala neznámá chyba. Chybová hláška: " + response.message!
      );
    }
  });
}

export function metadataSetup(): void {
  refreshMetadata();
}
