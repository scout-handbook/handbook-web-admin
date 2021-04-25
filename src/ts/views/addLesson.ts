/* global changed:true */
/* exported changed, addLessonInFieldOnClick */

function addLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

function showLessonAddView(field?: string): void {
  history.pushState({}, "title", "/admin/lessons"); // eslint-disable-line compat/compat

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
  changed = true;
}

function addLessonInFieldOnClick(event: MouseEvent): void {
  showLessonAddView(getAttribute(event, "id"));
}
