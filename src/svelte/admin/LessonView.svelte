<script lang="ts">
  import { Link, navigate } from "svelte-navigator";

  import { addField } from "../../ts/admin/actions/addField";
  import { addOnClicks } from "../../ts/admin/tools/addOnClicks";
  import { changeFieldOnClick } from "../../ts/admin/actions/changeField";
  import { changeLessonOnClick } from "../../ts/admin/views/mainSubviews/lesson";
  import { config } from "../../ts/admin/stores";
  import { deleteFieldOnClick } from "../../ts/admin/actions/deleteField";
  import { deleteLessonOnClick } from "../../ts/admin/actions/deleteLesson";
  import { Field } from "../../ts/admin/interfaces/Field";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { IDList } from "../../ts/admin/IDList";
  import { Lesson } from "../../ts/admin/interfaces/Lesson";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { renderLessonListLesson } from "../../ts/admin/views/mainSubviews/lesson";
  import { restoreLesson } from "../../ts/admin/actions/restoreLesson";

  export let fields: IDList<Field>;
  export let lessons: IDList<Lesson>;
  export let loginstate: Loginstate;

  $: adminPermissions = loginstate.role === "administrator" || loginstate.role === "superuser";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("lesson-manager")!.className += " active-top-bar-tab";

  addOnClicks("changeLesson", changeLessonOnClick);
  addOnClicks("deleteLesson", deleteLessonOnClick);
  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Lekce"}</h1>
{#if adminPermissions}
  <div class="button green-button" id="add-field" on:click={() => {addField();}}>
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
{#each lessons.asArray() as {id, value: lesson}}
  <!-- TODO: Precompute -->
  {#if (fields.filter(function (_, field) {
    return field.lessons.indexOf(id) >= 0;
  }).empty())}
    {@html renderLessonListLesson(id, lesson, "")}
  {/if}
{/each}
{#each fields.asArray() as {id, value: field}}
  <br>
  <h2 class="main-page">{field.name}</h2>
  {#if adminPermissions}
    <div class="button cyan-button changeField" data-id={id} on:click={changeFieldOnClick}>
      <i class="icon-pencil" />
      Upravit
    </div>
    <div class="button red-button deleteField" data-id={id} on:click={deleteFieldOnClick}>
      <i class="icon-trash-empty" />
      Smazat
    </div>
  {/if}
  <Link class="button green-button addLessonInField" data-id={id} to={"/lessons/add?field=" + id}>
    <i class="icon-plus" />
    Přidat lekci
  </Link>
  {#each lessons.asArray() as {id: lessonId, value: lesson}}
    {#if field.lessons.indexOf(lessonId) >= 0}
      {@html renderLessonListLesson(lessonId, lesson, " second-level")}
    {/if}
  {/each}
{/each}
