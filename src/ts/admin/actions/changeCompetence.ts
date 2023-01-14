import { Payload } from "../interfaces/Payload";
import { COMPETENCES } from "../metadata";
import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { dispatchIfChanged } from "../tools/dispatchIfChanged";
import { refreshLogin } from "../tools/refreshLogin";
import { getAttribute } from "../UI/button";
import { sidePanelOpen } from "../UI/sidePanel";

let competenceChanged = false;

function changeCompetencePayloadBuilder(): Payload {
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

export function changeCompetenceOnClick(event: MouseEvent): void {
  competenceChanged = false;
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button green-button" id="changeCompetenceSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Upravit kompetenci</h3><form id="side-panel-form">';
  const competence = COMPETENCES.get(getAttribute(event, "id"))!;
  html +=
    '<span class="competence-heading">Kompetence</span> <input type="text" class="form-text form-name" id="competence-number" value="' +
    competence.number.toString() +
    '" autocomplete="off"><br>';
  html +=
    '<input type="text" class="form-text" id="competence-name" value="' +
    competence.name +
    '" autocomplete="off"><br>';
  html +=
    '<textarea rows="5" class="form-text" id="competence-description" autocomplete="off">' +
    competence.description +
    "</textarea>";
  html += "</form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
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
  addOnChange("competence-number");
  addOnChange("competence-name");
  addOnChange("competence-description");

  history.pushState({ sidePanel: "open" }, "title", "/admin/competences");
  refreshLogin();
}
