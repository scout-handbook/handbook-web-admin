/* exported addCompetence */

function addCompetencePayloadBuilder(): Payload {
  return {
    number: encodeURIComponent(
      (document.getElementById("competence-number") as HTMLInputElement).value
    ),
    name: encodeURIComponent(
      (document.getElementById("competence-name") as HTMLInputElement).value
    ),
    description: encodeURIComponent(
      (document.getElementById("competence-description") as HTMLInputElement)
        .value
    ),
  };
}

function addCompetence(): void {
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="addCompetenceSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Přidat kompetenci</h3><form id="side-panel-form">';
  html +=
    '<span class="competence-heading">Kompetence</span> <input type="text" class="form-text form-name" id="competence-number" value="00" autocomplete="off"><br>';
  html +=
    '<input type="text" class="form-text" id="competence-name" value="Nová kompetence" autocomplete="off"><br>';
  html +=
    '<textarea rows="5" class="form-text" id="competence-description" autocomplete="off">Popis nové kompetence</textarea>';
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/competence",
      "POST",
      addCompetencePayloadBuilder
    ),
  ]);
  document.getElementById("addCompetenceSave")!.onclick = (): void =>
    aq.closeDispatch();

  history.pushState({ sidePanel: "open" }, "title", "/admin/competences");
  refreshLogin();
}
