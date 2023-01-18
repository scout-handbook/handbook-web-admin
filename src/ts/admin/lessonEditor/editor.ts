import { AfterLoadEvent } from "../AfterLoadEvent";
import { LessonSettingsCache } from "../interfaces/LessonSettingsCache";
import { RequestResponse } from "../interfaces/RequestResponse";
import { FIELDS, LESSONS } from "../metadata";
import { reAuthHandler, request } from "../tools/request";

export let changed: boolean;
export const lessonSettingsCache: LessonSettingsCache = {
  competences: [],
  field: "",
  groups: [],
};
export let lessonSettingsCacheEvent: AfterLoadEvent;

export function setChanged(value = true): void {
  changed = value;
}

export function populateEditorCache(id: string | null): void {
  lessonSettingsCacheEvent = new AfterLoadEvent(1);
  if (!id) {
    lessonSettingsCache["field"] = "";
    lessonSettingsCache["competences"] = [];
    lessonSettingsCache["groups"] = [];
    lessonSettingsCacheEvent.trigger();
    return;
  }
  request(
    CONFIG["api-uri"] + "/v1.0/lesson/" + id + "/group",
    "GET",
    {},
    function (response: RequestResponse): void {
      lessonSettingsCache["groups"] = response as Array<string>;
      lessonSettingsCacheEvent.trigger();
    },
    reAuthHandler
  );
  FIELDS.filter(function (_, field): boolean {
    return field.lessons.indexOf(id) >= 0;
  }).iterate(function (fieldId) {
    lessonSettingsCache["field"] = fieldId;
  });
  lessonSettingsCache["competences"] = LESSONS.get(id)!.competences;
}
