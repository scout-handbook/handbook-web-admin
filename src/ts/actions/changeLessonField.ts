/* global changed:true */
/* exported changed, changeLessonFieldOnClick */

let lessonFieldChanged = false;

function changeLessonFieldSave(
  id: string | null,
  actionQueue: ActionQueue
): void {
  id = id !== null ? id : "{id}";
  if (lessonFieldChanged) {
    changed = true;
    const fieldId = parseBoolForm()[0];
    actionQueue.actions.push(
      new Action(
        CONFIG["api-uri"] + "/v1.0/lesson/" + id + "/field",
        "PUT",
        function (): Payload {
          return { field: encodeURIComponent(fieldId) };
        }
      )
    );
    lessonSettingsCache.field = fieldId;
    lessonSettings(id, actionQueue, true);
  } else {
    lessonSettings(id, actionQueue, true);
  }
}

function lessonFieldOnclick(): void {
  lessonFieldChanged = true;
}

function changeLessonFieldOnClick(
  id: string | null,
  actionQueue: ActionQueue
): void {
  lessonFieldChanged = false;
  let html =
    '<div class="button yellow-button" id="cancelEditorAction"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeLessonFieldSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Změnit oblast</h3><form id="side-panel-form">';
  FIELDS.iterate(function (fieldId, field) {
    let checked = false;
    if (
      (fieldId && fieldId === lessonSettingsCache.field) ||
      (!fieldId && lessonSettingsCache.field === "")
    ) {
      checked = true;
    }
    html +=
      '<div class="form-row"><label class="form-switch"><input type="radio" name="field"';
    if (checked) {
      html += " checked";
    }
    if (fieldId) {
      html += ' data-id="' + fieldId + '"';
    } else {
      html += ' data-id=""';
    }
    html += '><span class="form-custom form-radio"></span></label>';
    if (fieldId) {
      html += field.name;
    } else {
      html += '<span class="anonymous-field">Nezařazeno</span>';
    }
    html += "</div>";
  });
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("cancelEditorAction")!.onclick = function (): void {
    lessonSettings(id, actionQueue, true);
  };
  document.getElementById("changeLessonFieldSave")!.onclick =
    function (): void {
      changeLessonFieldSave(id, actionQueue);
    };

  const nodes = document
    .getElementById("side-panel-form")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onchange = lessonFieldOnclick;
  }

  refreshLogin();
}
