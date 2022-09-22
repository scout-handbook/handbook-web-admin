import { navigate } from "svelte-navigator";

import { addField } from "../../actions/addField";
import { addOnClicks } from "../../tools/addOnClicks";
import { changeFieldOnClick } from "../../actions/changeField";
import { COMPETENCES, FIELDS, LESSONS, LOGINSTATE } from "../../metadata";
import { deleteFieldOnClick } from "../../actions/deleteField";
import { deleteLessonOnClick } from "../../actions/deleteLesson";
import { getAttribute } from "../../UI/button";
import { getElementsByClassName } from "../../tools/getElementsByClassName";
import { Lesson } from "../../interfaces/Lesson";
import { refreshLogin } from "../../tools/refreshLogin";
import { restoreLesson } from "../../actions/restoreLesson";
import { setMainPageTab } from "../main";
import { showLessonAddView } from "../addLesson";
import { showLessonEditView } from "../editLesson";

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

function renderLessonList(): string {
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

function changeLessonOnClick(event: MouseEvent): boolean {
  showLessonEditView(getAttribute(event, "id"), false);
  return false;
}

export function showLessonSubview(noHistory: boolean): void {
  setMainPageTab("lessons");
  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("lesson-manager")!.className += " active-top-bar-tab";
  let html = "<h1>" + CONFIG["site-name"] + " - Lekce</h1>";
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<div class="button green-button" id="add-field"><i class="icon-plus"></i>Přidat oblast</div>';
  }
  html +=
    '<div class="button green-button" id="add-lesson"><i class="icon-plus"></i>Přidat lekci</div>';
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<div class="button" id="restore-lesson"><i class="icon-history"></i>Smazané lekce</div>';
  }
  html += renderLessonList();
  document.getElementById("main-page")!.innerHTML = html;
  document.getElementById("main-page-container")!.scrollTop = 0;

  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    document.getElementById("add-field")!.onclick = function (): void {
      addField();
    };
  }
  document.getElementById("add-lesson")!.onclick = function (): void {
    showLessonAddView();
  };
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    document.getElementById("restore-lesson")!.onclick = restoreLesson;
  }

  addOnClicks("changeField", changeFieldOnClick);
  addOnClicks("deleteField", deleteFieldOnClick);
  const nodes2 = getElementsByClassName(
    "addLessonInField",
    document.getElementsByTagName("main")[0]
  );
  for (let i = 0; i < nodes2.length; i++) {
    (nodes2[i] as HTMLElement).onclick = () => {
      navigate("/admin/lessons/add"); // TODO: Field
    };
  }
  addOnClicks("changeLesson", changeLessonOnClick);
  addOnClicks("deleteLesson", deleteLessonOnClick);
  if (!noHistory) {
    history.pushState({ page: "lessons" }, "title", "/admin/lessons");
  }
  refreshLogin(true);
}
