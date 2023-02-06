import { AfterLoadEvent } from "./AfterLoadEvent";
import type { Competence } from "./interfaces/Competence";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";
import type { Loginstate } from "./interfaces/Loginstate";
import { fields, globalDialogMessage, groups } from "./stores";
import { get, map, sort } from "./tools/arrayTools";
import { rawRequest, request } from "./tools/request";

export let metadataEvent: AfterLoadEvent;
export let FIELDS: Array<[string, Field]>;
export let COMPETENCES: Array<[string, Competence]>;
export let GROUPS: Array<[string, Group]>;
export let LESSONS: Array<[string, Lesson]>;
export let LOGINSTATE: Loginstate = { avatar: "", name: "", role: "guest" };

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
  metadataEvent = new AfterLoadEvent(3);
  const metadataSortEvent = new AfterLoadEvent(3);
  metadataSortEvent.addCallback((): void => {
    sort(COMPETENCES, competenceComparator);
    map(LESSONS, (lesson) => {
      lesson.competences.sort((first: string, second: string): number =>
        competenceComparator(
          get(COMPETENCES, first)!,
          get(COMPETENCES, second)!
        )
      );
      return lesson;
    });
    sort(LESSONS, (first, second) =>
      lessonComparator(first, second, COMPETENCES)
    );
    map(FIELDS, (field) => {
      field.lessons.sort((first: string, second: string): number =>
        lessonComparator(
          get(LESSONS, first)!,
          get(LESSONS, second)!,
          COMPETENCES
        )
      );
      return field;
    });
    sort(FIELDS, (first, second) =>
      fieldComparator(first, second, LESSONS, COMPETENCES)
    );
    fields.set(FIELDS);
    metadataEvent.trigger();
  });
  void request<Record<string, Lesson>>(
    CONFIG["api-uri"] + "/v1.0/lesson?override-group=true",
    "GET",
    {},
    undefined
  ).then((response) => {
    LESSONS = Object.entries(response);
    metadataSortEvent.trigger();
  });
  void request<Record<string, Field>>(
    CONFIG["api-uri"] + "/v1.0/field?override-group=true",
    "GET",
    {},
    undefined
  ).then((response) => {
    FIELDS = Object.entries(response);
    metadataSortEvent.trigger();
  });
  void request<Record<string, Competence>>(
    CONFIG["api-uri"] + "/v1.0/competence",
    "GET",
    {},
    undefined
  ).then((response) => {
    COMPETENCES = Object.entries(response);
    metadataSortEvent.trigger();
  });
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
    GROUPS = processGroups(response);
    groups.set(GROUPS);
    metadataEvent.trigger();
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
        LOGINSTATE = response.response!;
        metadataEvent.trigger();
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
