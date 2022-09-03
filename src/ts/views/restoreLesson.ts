import { Action } from "../tools/Action";
import { ActionCallback } from "../tools/ActionCallback";
import { ActionQueue } from "../tools/ActionQueue";
import { editor, showLessonEditor, setChanged } from "../lessonEditor/editor";
import { Payload } from "../interfaces/Payload";

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
