import { COMPETENCES, LOGINSTATE } from "../../metadata";

export function renderCompetenceList(): string {
  let html = "";
  COMPETENCES.iterate(function (id, competence) {
    html +=
      '<h3 class = "main-page">' +
      competence.number.toString() +
      ": " +
      competence.name +
      "</h3><br>";
    if (
      LOGINSTATE.role === "administrator" ||
      LOGINSTATE.role === "superuser"
    ) {
      html +=
        '<div class="button cyan-button change-competence" data-id="' +
        id +
        '"><i class="icon-pencil"></i>Upravit</div>';
      html +=
        '<div class="button red-button delete-competence" data-id="' +
        id +
        '"><i class="icon-trash-empty"></i>Smazat</div><br>';
    }
    html +=
      '<span class="main-page competence-description">' +
      competence.description +
      "</span><br>";
  });
  return html;
}
