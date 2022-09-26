<script lang="ts">
  import { Link } from "svelte-navigator";

  import { addField } from "../../ts/admin/actions/addField";
  import { changeFieldOnClick } from "../../ts/admin/actions/changeField";
  import { Competence } from "../../ts/admin/interfaces/Competence";
  import { config } from "../../ts/admin/stores";
  import { deleteFieldOnClick } from "../../ts/admin/actions/deleteField";
  import { Field } from "../../ts/admin/interfaces/Field";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { IDList } from "../../ts/admin/IDList";
  import { Lesson } from "../../ts/admin/interfaces/Lesson";
  import LessonViewLesson from "./LessonViewLesson.svelte";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { restoreLesson } from "../../ts/admin/actions/restoreLesson";

  export let competences: IDList<Competence>;
  export let fields: IDList<Field>;
  export let lessons: IDList<Lesson>;
  export let loginstate: Loginstate;

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("lesson-manager")!.className += " active-top-bar-tab";

  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Lekce"}</h1>
{#if adminPermissions}
  <div
    id="add-field"
    class="button green-button"
    on:click={() => {
      addField();
    }}
  >
    <i class="icon-plus" />
    Přidat oblast
  </div>
{/if}
<Link id="add-lesson" class="button green-button" to="/lessons/add">
  <i class="icon-plus" />
  Přidat lekci
</Link>
{#if adminPermissions}
  <div id="restore-lesson" class="button" on:click={restoreLesson}>
    <i class="icon-history" />
    Smazané lekce
  </div>
{/if}
{#each lessons.asArray() as { id, value: lesson }}
  <!-- TODO: Precompute -->
  {#if fields
    .filter(function (_, field) {
      return field.lessons.indexOf(id) >= 0;
    })
    .empty()}
    <LessonViewLesson {id} {adminPermissions} {competences} {lesson} />
  {/if}
{/each}
{#each fields.asArray() as { id, value: field }}
  <br />
  <h2 class="main-page">{field.name}</h2>
  {#if adminPermissions}
    <div
      class="button cyan-button changeField"
      data-id={id}
      on:click={changeFieldOnClick}
    >
      <i class="icon-pencil" />
      Upravit
    </div>
    <div
      class="button red-button deleteField"
      data-id={id}
      on:click={deleteFieldOnClick}
    >
      <i class="icon-trash-empty" />
      Smazat
    </div>
  {/if}
  <Link
    class="button green-button addLessonInField"
    data-id={id}
    to={"/lessons/add?field=" + id}
  >
    <i class="icon-plus" />
    Přidat lekci
  </Link>
  {#each lessons.asArray() as { id: lessonId, value: lesson }}
    {#if field.lessons.indexOf(lessonId) >= 0}
      <LessonViewLesson
        id={lessonId}
        {adminPermissions}
        {competences}
        {lesson}
        secondLevel={true}
      />
    {/if}
  {/each}
{/each}
