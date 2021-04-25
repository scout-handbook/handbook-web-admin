/* exported changeCompetenceOnClick */

let competenceChanged = false;

function changeCompetencePayloadBuilder(): Payload {
  return {
    number: encodeURIComponent(
      (document.getElementById("competenceNumber") as HTMLInputElement).value
    ),
    name: encodeURIComponent(
      (document.getElementById("competenceName") as HTMLInputElement).value
    ),
    description: encodeURIComponent(
      (document.getElementById("competenceDescription") as HTMLInputElement)
        .value
    ),
  };
}

function changeCompetenceOnClick(event: MouseEvent): void {
  competenceChanged = false;
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="sidePanelCancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeCompetenceSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="sidePanelTitle">Upravit kompetenci</h3><form id="sidePanelForm">';
  const competence = COMPETENCES.get(getAttribute(event, "id"))!;
  html +=
    '<span class="competenceHeading">Kompetence</span> <input type="text" class="formText formName" id="competenceNumber" value="' +
    competence.number.toString() +
    '" autocomplete="off"><br>';
  html +=
    '<input type="text" class="formText" id="competenceName" value="' +
    competence.name +
    '" autocomplete="off"><br>';
  html +=
    '<textarea rows="5" class="formText" id="competenceDescription" autocomplete="off">' +
    competence.description +
    "</textarea>";
  html += "</form>";
  document.getElementById("sidePanel")!.innerHTML = html;

  document.getElementById("sidePanelCancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] +
        "/v1.0/competence/" +
        encodeURIComponent(getAttribute(event, "id")),
      "PUT",
      changeCompetencePayloadBuilder
    ),
  ]);
  document.getElementById("changeCompetenceSave")!.onclick = function (): void {
    dispatchIfChanged(aq, competenceChanged);
  };

  function addOnChange(id: string): void {
    document.getElementById(id)!.oninput = function (): void {
      competenceChanged = true;
    };
    document.getElementById(id)!.onchange = function (): void {
      competenceChanged = true;
    };
  }
  addOnChange("competenceNumber");
  addOnChange("competenceName");
  addOnChange("competenceDescription");

  history.pushState({ sidePanel: "open" }, "title", "/admin/competences");
  refreshLogin();
}
