import { navigate } from "svelte-navigator";

import { ActionQueue } from "../tools/ActionQueue";
import { AfterLoadEvent } from "../AfterLoadEvent";
import { dialog } from "../UI/dialog";
import { default as EasyMDE } from "easymde";
import { FIELDS, LESSONS } from "../metadata";
import { LessonSettingsCache } from "../interfaces/LessonSettingsCache";
import { reAuthHandler, request } from "../tools/request";
import { refreshLogin } from "../tools/refreshLogin";
import { refreshPreview } from "./refreshPreview";
import { RequestResponse } from "../interfaces/RequestResponse";

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

export function editorOnChange(afterAction: (() => void) | null): void {
  changed = true;
  refreshPreview(
    (document.getElementById("name") as HTMLInputElement).value,
    editor.value(),
    "preview-inner"
  );
  refreshLogin(false, afterAction);
}
