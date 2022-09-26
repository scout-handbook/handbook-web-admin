import { navigate } from "svelte-navigator";

import { COMPETENCES, FIELDS, LESSONS, LOGINSTATE } from "../../metadata";
import { getAttribute } from "../../UI/button";
import { Lesson } from "../../interfaces/Lesson";

function renderLessonListLesson(
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

export function renderLessonList(): string {
  let html = "";
  LESSONS.iterate(function (id, lesson) {
    const inField = !FIELDS.filter(function (_, field) {
      return field.lessons.indexOf(id) >= 0;
    }).empty();
    if (!inField) {
      html += renderLessonListLesson(id, lesson, "");
    }
  });
  FIELDS.iterate(function (id, field) {
    html += '<br><h2 class="main-page">' + field.name + "</h2>";
    if (
      LOGINSTATE.role === "administrator" ||
      LOGINSTATE.role === "superuser"
    ) {
      html +=
        '<div class="button cyan-button changeField" data-id="' +
        id +
        '"><i class="icon-pencil"></i>Upravit</div>';
      html +=
        '<div class="button red-button deleteField" data-id="' +
        id +
        '"><i class="icon-trash-empty"></i>Smazat</div>';
    }
    html +=
      '<div class="button green-button addLessonInField" data-id="' +
      id +
      '"><i class="icon-plus"></i>Přidat lekci</div>';
    LESSONS.iterate(function (lessonId, lesson) {
      if (field.lessons.indexOf(lessonId) >= 0) {
        html += renderLessonListLesson(lessonId, lesson, " second-level");
      }
    });
  });
  return html;
}

export function changeLessonOnClick(event: MouseEvent): boolean {
  navigate("/admin/lessons/" + getAttribute(event, "id") + "/edit");
  return false;
}
