import { AfterLoadEvent } from "./AfterLoadEvent";
import { Competence } from "./interfaces/Competence";
import { dialog } from "./UI/dialog";
import { Field } from "./interfaces/Field";
import { Group } from "./interfaces/Group";
import { IDList } from "./IDList";
import { Lesson } from "./interfaces/Lesson";
import { fields, competences, groups, lessons, loginstate } from "./stores";
import { Loginstate } from "./interfaces/Loginstate";
import { rawRequest, request } from "./tools/request";

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
    COMPETENCES.get(first.competences[0])!,
    COMPETENCES.get(second.competences[0])!
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
    LESSONS.get(first.lessons[0])!,
    LESSONS.get(second.lessons[0])!
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
          COMPETENCES.get(first)!,
          COMPETENCES.get(second)!
        );
      });
      return value;
    });
    LESSONS.sort(lessonComparator);
    FIELDS.map(function (value: Field): Field {
      value.lessons.sort(function (first: string, second: string): number {
        return lessonComparator(LESSONS.get(first)!, LESSONS.get(second)!);
      });
      return value;
    });
    FIELDS.sort(fieldComparator);
    competences.set(Promise.resolve(COMPETENCES));
    lessons.set(Promise.resolve(LESSONS));
    fields.set(Promise.resolve(FIELDS));
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
      groups.set(Promise.resolve(GROUPS));
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
          ["editor", "administrator", "superuser"].indexOf(
            (response.response as Loginstate).role
          ) > -1
        ) {
          LOGINSTATE = response.response as Loginstate;
          loginstate.set(Promise.resolve(LOGINSTATE));
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
        dialog(
          "Nastala neznámá chyba. Chybová hláška:<br>" + response.message!,
          "OK"
        );
      }
    }
  );
}

export function metadataSetup(): void {
  refreshMetadata();
}
