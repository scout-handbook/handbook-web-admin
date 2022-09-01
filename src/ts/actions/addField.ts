/* exported addField */

function addFieldPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("fieldName") as HTMLInputElement).value
    ),
    description: encodeURIComponent(
      (document.getElementById("fieldDescription") as HTMLInputElement).value
    ),
    image: encodeURIComponent(
      (document.getElementById("fieldImage") as HTMLInputElement).value
    ),
    icon: encodeURIComponent(
      (document.getElementById("fieldIcon") as HTMLInputElement).value
    ),
  };
}

function addField(
  state: Record<string, string> = {
    name: "Nová oblast",
    description: "Popis nové oblasti",
    image: "00000000-0000-0000-0000-000000000000",
    icon: "00000000-0000-0000-0000-000000000000",
  },
  noHistory = false
): void {
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="addFieldSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Přidat oblast</h3><form id="side-panel-form">';
  html += '<legend for="fieldName">Název:</legend>';
  html +=
    '<input type="text" class="form-text formName" id="fieldName" value="' +
    state.name +
    '" autocomplete="off">';
  html +=
    '<textarea rows="5" class="form-text" id="fieldDescription" autocomplete="off">' +
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
    openSidePanelImageSelector("addField", "image", {
      name: (document.getElementById("fieldName") as HTMLInputElement).value,
      description: (
        document.getElementById("fieldDescription") as HTMLInputElement
      ).value,
      image: state.image,
      icon: state.icon,
    });
  };
  document.getElementById("fieldIconChange")!.onclick = function (): void {
    openSidePanelImageSelector("addField", "icon", {
      name: (document.getElementById("fieldName") as HTMLInputElement).value,
      description: (
        document.getElementById("fieldDescription") as HTMLInputElement
      ).value,
      image: state.image,
      icon: state.icon,
    });
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/field",
      "POST",
      addFieldPayloadBuilder
    ),
  ]);
  document.getElementById("addFieldSave")!.onclick = (): void =>
    aq.closeDispatch();

  if (!noHistory) {
    history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  }
  refreshLogin();
}
