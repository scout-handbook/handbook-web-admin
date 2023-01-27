import { AfterLoadEvent } from "./AfterLoadEvent";
import type { Competence } from "./interfaces/Competence";
import type { Field } from "./interfaces/Field";
import type { Group } from "./interfaces/Group";
import type { Lesson } from "./interfaces/Lesson";
import type { Loginstate } from "./interfaces/Loginstate";
import {
  competences,
  fields,
  globalDialogMessage,
  groups,
  lessons,
  loginstate,
} from "./stores";
import { get } from "./tools/arrayTools";
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

function lessonComparator(first: Lesson, second: Lesson): number {
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
    get(COMPETENCES, first.competences[0])!,
    get(COMPETENCES, second.competences[0])!
  );
}

function fieldComparator(first: Field, second: Field): number {
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
    get(LESSONS, first.lessons[0])!,
    get(LESSONS, second.lessons[0])!
  );
}

export function refreshMetadata(): void {
  metadataEvent = new AfterLoadEvent(3);
  const metadataSortEvent = new AfterLoadEvent(3);
  metadataSortEvent.addCallback(function (): void {
    COMPETENCES.sort(([_1, first], [_2, second]) =>
      competenceComparator(first, second)
    );
    LESSONS.map(([id, lesson]): [string, Lesson] => {
      lesson.competences.sort(function (first: string, second: string): number {
        return competenceComparator(
          get(COMPETENCES, first)!,
          get(COMPETENCES, second)!
        );
      });
      return [id, lesson];
    });
    LESSONS.sort(([_1, first], [_2, second]) =>
      lessonComparator(first, second)
    );
    FIELDS.map(([id, field]): [string, Field] => {
      field.lessons.sort(function (first: string, second: string): number {
        return lessonComparator(get(LESSONS, first)!, get(LESSONS, second)!);
      });
      return [id, field];
    });
    FIELDS.sort(([_1, first], [_2, second]) => fieldComparator(first, second));
    competences.set(COMPETENCES);
    lessons.set(LESSONS);
    fields.set(FIELDS);
    metadataEvent.trigger();
  });
  request(
    CONFIG["api-uri"] + "/v1.0/lesson?override-group=true",
    "GET",
    {},
    function (response): void {
      LESSONS = Object.entries(response as Record<string, Lesson>);
      metadataSortEvent.trigger();
    },
    undefined
  );
  request(
    CONFIG["api-uri"] + "/v1.0/field?override-group=true",
    "GET",
    {},
    function (response): void {
      FIELDS = Object.entries(response as Record<string, Field>);
      metadataSortEvent.trigger();
    },
    undefined
  );
  request(
    CONFIG["api-uri"] + "/v1.0/competence",
    "GET",
    {},
    function (response): void {
      COMPETENCES = Object.entries(response as Record<string, Competence>);
      metadataSortEvent.trigger();
    },
    undefined
  );
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
  request(
    CONFIG["api-uri"] + "/v1.0/group",
    "GET",
    {},
    function (response): void {
      GROUPS = Object.entries(response as Record<string, Group>);
      GROUPS.sort(([_1, first], [_2, second]): number =>
        first.name.localeCompare(second.name)
      );
      groups.set(GROUPS);
      metadataEvent.trigger();
    },
    groupExceptionHandler
  );
  rawRequest(
    CONFIG["api-uri"] + "/v1.0/account",
    "GET",
    undefined,
    function (response): void {
      if (response.status === 200) {
        if (
          ["editor", "administrator", "superuser"].includes(
            (response.response as Loginstate).role
          )
        ) {
          LOGINSTATE = response.response as Loginstate;
          loginstate.set(LOGINSTATE);
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
    }
  );
}

export function metadataSetup(): void {
  refreshMetadata();
}
