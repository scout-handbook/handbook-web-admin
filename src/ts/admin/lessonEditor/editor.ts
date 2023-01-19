import { AfterLoadEvent } from "../AfterLoadEvent";
import { LessonSettingsCache } from "../interfaces/LessonSettingsCache";
import { RequestResponse } from "../interfaces/RequestResponse";
import { reAuthHandler, request } from "../tools/request";

export let changed: boolean;
export const lessonSettingsCache: LessonSettingsCache = {
  groups: [],
};
export let lessonSettingsCacheEvent: AfterLoadEvent;

export function setChanged(value = true): void {
  changed = value;
}

export function populateEditorCache(id: string | null): void {
  lessonSettingsCacheEvent = new AfterLoadEvent(1);
  if (!id) {
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
}
