/* exported addGroup */

function addGroupPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("groupName") as HTMLInputElement).value
    ),
  };
}

function addGroup(): void {
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="addGroupSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Přidat skupinu</h3><form id="side-panel-form">';
  html += '<legend for="fieldName">Název:</legend>';
  html +=
    '<input type="text" class="form-text" id="groupName" value="Nová skupina" autocomplete="off"><br>';
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/group",
      "POST",
      addGroupPayloadBuilder
    ),
  ]);
  document.getElementById("addGroupSave")!.onclick = (): void =>
    aq.closeDispatch();

  history.pushState({ sidePanel: "open" }, "title", "/admin/groups");
  refreshLogin();
}
