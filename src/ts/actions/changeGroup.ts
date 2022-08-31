/* exported changeGroupOnClick */

let groupChanged = false;

function changeGrouPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("groupName") as HTMLInputElement).value
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
    '<input type="text" class="formText" id="groupName" value="' +
    GROUPS.get(getAttribute(event, "id"))!.name +
    '" autocomplete="off"><br>';
  html += "</form>";
  document.getElementById("sidePanel")!.innerHTML = html;

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

  document.getElementById("groupName")!.oninput = function (): void {
    groupChanged = true;
  };
  document.getElementById("groupName")!.onchange = function (): void {
    groupChanged = true;
  };

  history.pushState({ sidePanel: "open" }, "title", "/admin/groups");
  refreshLogin();
}
