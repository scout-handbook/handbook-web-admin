<script lang="ts">
  import { navigate } from "svelte-navigator";

  import { addField } from "../../ts/admin/actions/addField";
  import { addOnClicks } from "../../ts/admin/tools/addOnClicks";
  import { changeFieldOnClick } from "../../ts/admin/actions/changeField";
  import { changeLessonOnClick } from "../../ts/admin/views/mainSubviews/lesson";
  import { deleteFieldOnClick } from "../../ts/admin/actions/deleteField";
  import { deleteLessonOnClick } from "../../ts/admin/actions/deleteLesson";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { renderLessonList } from "../../ts/admin/views/mainSubviews/lesson";
  import { restoreLesson } from "../../ts/admin/actions/restoreLesson";

  export let loginstate: Loginstate;

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("lesson-manager")!.className += " active-top-bar-tab";
  let html = "<h1>" + CONFIG["site-name"] + " - Lekce</h1>";
  if (loginstate.role === "administrator" || loginstate.role === "superuser") {
    html +=
      '<div class="button green-button" id="add-field"><i class="icon-plus"></i>Přidat oblast</div>';
  }
  html +=
    '<div class="button green-button" id="add-lesson"><i class="icon-plus"></i>Přidat lekci</div>';
  if (loginstate.role === "administrator" || loginstate.role === "superuser") {
    html +=
      '<div class="button" id="restore-lesson"><i class="icon-history"></i>Smazané lekce</div>';
  }
  html += renderLessonList();
  document.getElementById("main-page")!.innerHTML = html;

  if (loginstate.role === "administrator" || loginstate.role === "superuser") {
    document.getElementById("add-field")!.onclick = function (): void {
      addField();
    };
  }
  document.getElementById("add-lesson")!.onclick = function (): void {
    navigate("/admin/lessons/add");
  };
  if (loginstate.role === "administrator" || loginstate.role === "superuser") {
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
      const fieldId = (nodes2[i] as HTMLElement).dataset.id!;
      navigate("/admin/lessons/add?field=" + fieldId);
    };
  }
  addOnClicks("changeLesson", changeLessonOnClick);
  addOnClicks("deleteLesson", deleteLessonOnClick);
  refreshLogin(true);
</script>
