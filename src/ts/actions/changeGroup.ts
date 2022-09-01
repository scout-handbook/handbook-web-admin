/* exported changeGroupOnClick */

let groupChanged = false;

function changeGrouPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("group-name") as HTMLInputElement).value
    ),
  };
}

function changeGroupOnClick(event: MouseEvent): void {
  groupChanged = false;
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeGroupSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Upravit skupinu</h3><form id="side-panel-form">';
  html += '<legend for="fieldName">Název:</legend>';
  html +=
    '<input type="text" class="form-text" id="group-name" value="' +
    GROUPS.get(getAttribute(event, "id"))!.name +
    '" autocomplete="off"><br>';
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] +
        "/v1.0/group/" +
        encodeURIComponent(getAttribute(event, "id")),
      "PUT",
      changeGrouPayloadBuilder
    ),
  ]);
  document.getElementById("changeGroupSave")!.onclick = function (): void {
    dispatchIfChanged(aq, groupChanged);
  };

  document.getElementById("group-name")!.oninput = function (): void {
    groupChanged = true;
  };
  document.getElementById("group-name")!.onchange = function (): void {
    groupChanged = true;
  };

  history.pushState({ sidePanel: "open" }, "title", "/admin/groups");
  refreshLogin();
}
