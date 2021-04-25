/* global COMPETENCES:true, FIELDS:true, GROUPS:true, LESSONS:true, LOGINSTATE:true, metadataEvent:true */
/* exported COMPETENCES, FIELDS, GROUPS, LESSONS, LOGINSTATE, metadataSetup */

let metadataEvent: AfterLoadEvent;
let FIELDS: IDList<Field>;
let COMPETENCES: IDList<Competence>;
let GROUPS: IDList<Group>;
let LESSONS: IDList<Lesson>;
let LOGINSTATE: Loginstate = { avatar: "", name: "", role: "guest" };

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

function refreshMetadata(): void {
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

function metadataSetup(): void {
  refreshMetadata();
}
