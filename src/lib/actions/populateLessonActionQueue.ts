import type { ActionQueue } from "$lib/actions/ActionQueue";

import { Action } from "$lib/actions/Action";
import { apiUri } from "$lib/config";

export function populateCompetences(
  actionQueue: ActionQueue,
  lessonID: string | null,
  competences: Array<string>,
  initialCompetences: Array<string> = [],
): void {
  if (arrayEquals(initialCompetences, competences)) {
    return;
  }
  const encodedID = lessonID !== null ? encodeURIComponent(lessonID) : "{id}";
  actionQueue.actions.push(
    new Action(`${apiUri}/v1.0/lesson/${encodedID}/competence`, "PUT", {
      competence: competences.map(encodeURIComponent),
    }),
  );
}

export function populateField(
  actionQueue: ActionQueue,
  lessonID: string | null,
  field: string | null,
  initialField: string | null = null,
): void {
  if (initialField === field) {
    return;
  }
  const encodedID = lessonID !== null ? encodeURIComponent(lessonID) : "{id}";
  actionQueue.actions.push(
    new Action(
      `${apiUri}/v1.0/lesson/${encodedID}/field`,
      "PUT",
      field !== null
        ? {
            field: encodeURIComponent(field),
          }
        : {},
    ),
  );
}

export function populateGroups(
  actionQueue: ActionQueue,
  lessonID: string | null,
  groups: Array<string>,
  initialGroups: Array<string> = [],
): void {
  if (arrayEquals(initialGroups, groups)) {
    return;
  }
  const encodedID = lessonID !== null ? encodeURIComponent(lessonID) : "{id}";
  actionQueue.actions.push(
    new Action(`${apiUri}/v1.0/lesson/${encodedID}/group`, "PUT", {
      group: groups.map(encodeURIComponent),
    }),
  );
}

function arrayEquals<T>(a: Array<T>, b: Array<T>): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
