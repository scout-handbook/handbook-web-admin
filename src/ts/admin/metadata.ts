import { AfterLoadEvent } from "./AfterLoadEvent";
import { IDList } from "./IDList";
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
import { rawRequest, request } from "./tools/request";
import { get } from "./tools/arrayTools";

export let metadataEvent: AfterLoadEvent;
export let FIELDS: IDList<Field>;
export let COMPETENCES: IDList<Competence>;
export let GROUPS: IDList<Group>;
export let LESSONS: IDList<Lesson>;
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
    get(COMPETENCES.entries(), first.competences[0])!,
    get(COMPETENCES.entries(), second.competences[0])!
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
    get(LESSONS.entries(), first.lessons[0])!,
    get(LESSONS.entries(), second.lessons[0])!
  );
}

export function refreshMetadata(): void {
  metadataEvent = new AfterLoadEvent(3);
  const metadataSortEvent = new AfterLoadEvent(3);
  metadataSortEvent.addCallback(function (): void {
    COMPETENCES.sort(competenceComparator);
    LESSONS.map(function (value: Lesson): Lesson {
      value.competences.sort(function (first: string, second: string): number {
        return competenceComparator(
          get(COMPETENCES.entries(), first)!,
          get(COMPETENCES.entries(), second)!
        );
      });
      return value;
    });
    LESSONS.sort(lessonComparator);
    FIELDS.map(function (value: Field): Field {
      value.lessons.sort(function (first: string, second: string): number {
        return lessonComparator(
          get(LESSONS.entries(), first)!,
          get(LESSONS.entries(), second)!
        );
      });
      return value;
    });
    FIELDS.sort(fieldComparator);
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
      LESSONS = new IDList<Lesson>(response as Record<string, Lesson>);
      metadataSortEvent.trigger();
    },
    undefined
  );
  request(
    CONFIG["api-uri"] + "/v1.0/field?override-group=true",
    "GET",
    {},
    function (response): void {
      FIELDS = new IDList<Field>(response as Record<string, Field>);
      metadataSortEvent.trigger();
    },
    undefined
  );
  request(
    CONFIG["api-uri"] + "/v1.0/competence",
    "GET",
    {},
    function (response): void {
      COMPETENCES = new IDList<Competence>(
        response as Record<string, Competence>
      );
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
      GROUPS = new IDList<Group>(response as Record<string, Group>);
      GROUPS.sort(function (first: Group, second: Group): number {
        return first.name.localeCompare(second.name);
      });
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
