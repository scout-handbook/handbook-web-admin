<script lang="ts">
  import { Link } from "svelte-navigator";

  import { addField } from "../../ts/admin/actions/addField";
  import { addOnClicks } from "../../ts/admin/tools/addOnClicks";
  import { changeFieldOnClick } from "../../ts/admin/actions/changeField";
  import { changeLessonOnClick } from "../../ts/admin/views/mainSubviews/lesson";
  import { config } from "../../ts/admin/stores";
  import { deleteFieldOnClick } from "../../ts/admin/actions/deleteField";
  import { deleteLessonOnClick } from "../../ts/admin/actions/deleteLesson";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { renderLessonList } from "../../ts/admin/views/mainSubviews/lesson";
  import { restoreLesson } from "../../ts/admin/actions/restoreLesson";

  export let loginstate: Loginstate;
  $: adminPermissions = loginstate.role === "administrator" || loginstate.role === "superuser";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("lesson-manager")!.className += " active-top-bar-tab";

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

<h1>{$config["site-name"] + " - Lekce"}</h1>
{#if adminPermissions}
  <div class="button green-button" id="add-field" on:click={addField}>
    <i class="icon-plus" />
    Přidat oblast
  </div>
{/if}
<Link class="button green-button" id="add-lesson" to="/lessons/add">
  <i class="icon-plus" />
  Přidat lekci
</Link>
{#if adminPermissions}
  <div class="button" id="restore-lesson" on:click={restoreLesson}>
    <i class="icon-history" />
    Smazané lekce
  </div>
{/if}
{@html renderLessonList()}
