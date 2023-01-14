import { Payload } from "../interfaces/Payload";
import { editor, setChanged, showLessonEditor } from "../lessonEditor/editor";
import { Action } from "../tools/Action";
import { ActionCallback } from "../tools/ActionCallback";
import { ActionQueue } from "../tools/ActionQueue";

function restoreLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

export function showLessonRestoreView(name: string, body: string): void {
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
