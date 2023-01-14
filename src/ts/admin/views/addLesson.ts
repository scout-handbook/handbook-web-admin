import { Payload } from "../interfaces/Payload";
import { defaultBody, defaultName } from "../lessonEditor/defaultContent";
import { editor, setChanged, showLessonEditor } from "../lessonEditor/editor";
import { Action } from "../tools/Action";
import { ActionCallback } from "../tools/ActionCallback";
import { ActionQueue } from "../tools/ActionQueue";
import { getAttribute } from "../UI/button";

function addLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

export function showLessonAddView(field?: string): void {
  history.pushState({}, "title", "/admin/lessons");

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/lesson",
      "POST",
      addLessonPayloadBuilder,
      [ActionCallback.FillID]
    ),
  ]);
  if (field) {
    aq.actions.push(
      new Action(
        CONFIG["api-uri"] + "/v1.0/lesson/{id}/field",
        "PUT",
        function (): Payload {
          return { field: encodeURIComponent(field) };
        }
      )
    );
  }
  showLessonEditor(defaultName, defaultBody, aq, null);
  setChanged();
}

export function addLessonInFieldOnClick(event: MouseEvent): void {
  showLessonAddView(getAttribute(event, "id"));
}
