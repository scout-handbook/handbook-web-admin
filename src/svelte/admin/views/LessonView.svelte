<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import { IDList } from "../../../ts/admin/IDList";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import { Field } from "../../../ts/admin/interfaces/Field";
  import { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { siteName } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import AddFieldPanel from "../components/action-modals/AddFieldPanel.svelte";
  import ChangeFieldPanel from "../components/action-modals/ChangeFieldPanel.svelte";
  import DeleteFieldDialog from "../components/action-modals/DeleteFieldDialog.svelte";
  import DeleteLessonDialog from "../components/action-modals/DeleteLessonDialog.svelte";
  import RestoreLessonPanel from "../components/action-modals/RestoreLessonPanel.svelte";
  import Button from "../components/Button.svelte";
  import LessonViewLesson from "../components/LessonViewLesson.svelte";

  export let competences: IDList<Competence>;
  export let fields: IDList<Field>;
  export let lessons: IDList<Lesson>;
  export let loginstate: Loginstate;

  const navigate = useNavigate();
  const location = useLocation();
  $: action = $location.state?.action as string | null;
  $: actionPayload = $location.state?.actionPayload as {
    fieldId: string;
    lessonId: string;
  };

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-field"}
  <AddFieldPanel />
{:else if action === "change-field"}
  <ChangeFieldPanel {fields} payload={actionPayload} />
{:else if action === "delete-field"}
  <DeleteFieldDialog {fields} payload={actionPayload} />
{:else if action === "delete-lesson"}
  <DeleteLessonDialog {lessons} payload={actionPayload} />
{:else if action === "restore-lesson"}
  <RestoreLessonPanel />
{/if}

<h1>{$siteName + " - Lekce"}</h1>
{#if adminPermissions}
  <Button
    green
    icon="plus"
    on:click={() => {
      navigate("/lessons", { state: { action: "add-field" } });
    }}
  >
    Přidat oblast
  </Button>
{/if}
<Button
  green
  icon="plus"
  on:click={() => {
    navigate("/lessons/add");
  }}
>
  Přidat lekci
</Button>
{#if adminPermissions}
  <Button
    icon="history"
    on:click={() => {
      navigate("/lessons", { state: { action: "restore-lesson" } });
    }}
  >
    Smazané lekce
  </Button>
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
    <Button
      cyan
      icon="pencil"
      on:click={() => {
        navigate("/lessons", {
          state: { action: "change-field", actionPayload: { fieldId: id } },
        });
      }}
    >
      Upravit
    </Button>
    <Button
      icon="trash-empty"
      red
      on:click={() => {
        navigate("/lessons", {
          state: { action: "delete-field", actionPayload: { fieldId: id } },
        });
      }}
    >
      Smazat
    </Button>
  {/if}
  <Button
    green
    icon="plus"
    on:click={() => {
      navigate("/lessons/add?field=" + id);
    }}
  >
    Přidat lekci
  </Button>
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
