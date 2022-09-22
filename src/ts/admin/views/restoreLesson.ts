import { Action } from "../tools/Action";
import { ActionCallback } from "../tools/ActionCallback";
import { ActionQueue } from "../tools/ActionQueue";
import { editor, showLessonEditor, setChanged } from "../lessonEditor/editor";
import { refreshPreview } from "../lessonEditor/refreshPreview";
import { Payload } from "../interfaces/Payload";
import { RequestResponse } from "../interfaces/RequestResponse";
import { authFailHandler, request } from "../tools/request";

function restoreLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

function renderLessonRestoreView(name: string, body: string): void {
  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/lesson",
      "POST",
      restoreLessonPayloadBuilder,
      [ActionCallback.FillID]
    ),
  ]);
  history.replaceState({}, "title", "/admin/lessons");
  showLessonEditor(name, body, aq, null);
  setChanged();
}

export function showLessonRestoreView(
  id: string,
  version: string,
  name: string | null
): void {
  request(
    CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + id + "/history/" + version,
    "GET",
    {},
    function (response: RequestResponse): void {
      const body = response as string;
      refreshPreview(name ?? "Obnovená lekce", body, "restore-lesson-preview");
      renderLessonRestoreView(name ?? "Obnovená lekce", body);
    },
    authFailHandler
  );
}
