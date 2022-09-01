/* exported changeFieldOnClick */

let fieldChanged = false;

function changeFieldPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("fieldName") as HTMLInputElement).value
    ),
    description: encodeURIComponent(
      (document.getElementById("field-description") as HTMLInputElement).value
    ),
    image: encodeURIComponent(
      (document.getElementById("fieldImage") as HTMLInputElement).value
    ),
    icon: encodeURIComponent(
      (document.getElementById("fieldIcon") as HTMLInputElement).value
    ),
  };
}

function changeField(
  state: Record<string, string>,
  noHistory = false,
  changed = false
): void {
  fieldChanged = changed;
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeFieldSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Upravit oblast</h3><form id="side-panel-form">';
  html += '<legend for="fieldName">Název:</legend>';
  html +=
    '<input type="text" class="form-text form-name" id="fieldName" value="' +
    state.name +
    '" autocomplete="off">';
  html +=
    '<textarea rows="5" class="form-text" id="field-description" autocomplete="off">' +
    state.description +
    "</textarea>";
  html += '<legend for="fieldImage">Náhledový obrázek:</legend>';
  html += '<input type="hidden" id="fieldImage" value="' + state.image + '">';
  html +=
    '<image src="' +
    CONFIG["api-uri"] +
    "/v1.0/image/" +
    state.image +
    '?quality=thumbnail">';
  html +=
    '<br><div class="button" id="fieldImageChange"><i class="icon-pencil"></i>Změnit</div>';
  html += '<legend for="fieldIcon">Ikona:</legend>';
  html += '<input type="hidden" id="fieldIcon" value="' + state.icon + '">';
  html +=
    '<image src="' +
    CONFIG["api-uri"] +
    "/v1.0/image/" +
    state.icon +
    '?quality=thumbnail">';
  html +=
    '<br><div class="button" id="fieldIconChange"><i class="icon-pencil"></i>Změnit</div>';
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };

  document.getElementById("fieldImageChange")!.onclick = function (): void {
    openSidePanelImageSelector("changeField", "image", {
      id: state.id,
      name: (document.getElementById("fieldName") as HTMLInputElement).value,
      description: (
        document.getElementById("field-description") as HTMLInputElement
      ).value,
      image: state.image,
      icon: state.icon,
    });
  };

  document.getElementById("fieldIconChange")!.onclick = function (): void {
    openSidePanelImageSelector("changeField", "icon", {
      id: state.id,
      name: (document.getElementById("fieldName") as HTMLInputElement).value,
      description: (
        document.getElementById("field-description") as HTMLInputElement
      ).value,
      image: state.image,
      icon: state.icon,
    });
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/field/" + encodeURIComponent(state.id),
      "PUT",
      changeFieldPayloadBuilder
    ),
  ]);
  document.getElementById("changeFieldSave")!.onclick = function (): void {
    dispatchIfChanged(aq, fieldChanged);
  };

  document.getElementById("fieldName")!.oninput = function (): void {
    fieldChanged = true;
  };
  document.getElementById("fieldName")!.onchange = function (): void {
    fieldChanged = true;
  };
  document.getElementById("field-description")!.oninput = function (): void {
    fieldChanged = true;
  };
  document.getElementById("field-description")!.onchange = function (): void {
    fieldChanged = true;
  };

  if (!noHistory) {
    history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  }
  refreshLogin();
}

function changeFieldOnClick(event: MouseEvent): void {
  const id = getAttribute(event, "id");
  const field = FIELDS.get(id)!;
  changeField({
    id: id,
    name: field.name,
    description: field.description,
    image: field.image,
    icon: field.icon,
  });
}
