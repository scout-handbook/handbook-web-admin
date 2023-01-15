import { default as EasyMDE } from "easymde";
import { navigate } from "svelte-navigator";

import { AfterLoadEvent } from "../AfterLoadEvent";
import { LessonSettingsCache } from "../interfaces/LessonSettingsCache";
import { RequestResponse } from "../interfaces/RequestResponse";
import { FIELDS, LESSONS } from "../metadata";
import { ActionQueue } from "../tools/ActionQueue";
import { refreshLogin } from "../tools/refreshLogin";
import { reAuthHandler, request } from "../tools/request";
import { dialog } from "../UI/dialog";
import { refreshPreview } from "./refreshPreview";

export let changed: boolean;
export const lessonSettingsCache: LessonSettingsCache = {
  competences: [],
  field: "",
  groups: [],
};
export let lessonSettingsCacheEvent: AfterLoadEvent;
export let editor: EasyMDE;

export function setEditor(value: EasyMDE): void {
  editor = value;
}

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

function editorDiscardNow(actionQueue: ActionQueue): void {
  navigate("/admin/lessons");
  actionQueue.dispatch(true);
}

export function editorDiscard(actionQueue: ActionQueue): void {
  if (!changed) {
    editorDiscardNow(actionQueue);
  } else {
    dialog(
      "Opravdu si přejete zahodit všechny změny?",
      "Ano",
      function (): void {
        editorDiscardNow(actionQueue);
      },
      "Ne"
    );
  }
  refreshLogin();
}

export function editorOnChange(
  name: string,
  body: string,
  afterAction: (() => void) | null
): void {
  changed = true;
  refreshPreview(
    name,
    body,
    "preview-inner"
  );
  refreshLogin(false, afterAction);
}
