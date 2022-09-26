import { navigate } from "svelte-navigator";

import { COMPETENCES, LOGINSTATE } from "../../metadata";
import { getAttribute } from "../../UI/button";
import { Lesson } from "../../interfaces/Lesson";

export function renderLessonListLesson(
  id: string,
  lesson: Lesson,
  secondLevel: string
): string {
  let html =
    '<br><h3 class="main-page' + secondLevel + '">' + lesson.name + "</h3>";
  html +=
    '<div class="button cyan-button changeLesson" data-id="' +
    id +
    '"><i class="icon-pencil"></i>Upravit</div>';
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<div class="button red-button deleteLesson" data-id="' +
      id +
      '"><i class="icon-trash-empty"></i>Smazat</div>';
  }
  html +=
    '<a href="' +
    CONFIG["admin-uri"] +
    "/lesson/" +
    id +
    '" target="_blank" class="button exportLesson"><i class="icon-file-pdf"></i>PDF</a>';
  html += '<br><span class="main-page' + secondLevel + '">Kompetence: ';
  let first = true;
  COMPETENCES.filter(function (competenceId) {
    return lesson.competences.indexOf(competenceId) >= 0;
  }).iterate(function (_, competence) {
    if (!first) {
      html += ", ";
    }
    html += competence.number.toString();
    first = false;
  });
  html += "</span>";
  return html;
}

export function changeLessonOnClick(event: MouseEvent): boolean {
  navigate("/admin/lessons/" + getAttribute(event, "id") + "/edit");
  return false;
}
