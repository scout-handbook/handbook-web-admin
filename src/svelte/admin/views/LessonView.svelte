<script lang="ts" strictEvents>
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { IDList } from "../../../ts/admin/IDList";
  import type { Competence } from "../../../ts/admin/interfaces/Competence";
  import type { Field } from "../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
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
  const location = useLocation<{
    action: string;
    actionPayload: {
      fieldId: string;
      lessonId: string;
    };
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

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
{#each lessons.entries() as [lessonId, lesson]}
  <!-- TODO: Precompute -->
  {#if fields.entries()
    .filter(([_, field]) => field.lessons.includes(lessonId))
    .length === 0}
    <LessonViewLesson id={lessonId} {adminPermissions} {competences} {lesson} />
  {/if}
{/each}
{#each fields.entries() as [fieldId, field]}
  <br />
  <h2 class="main-page">{field.name}</h2>
  {#if adminPermissions}
    <Button
      cyan
      icon="pencil"
      on:click={() => {
        navigate("/lessons", {
          state: { action: "change-field", actionPayload: { fieldId } },
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
          state: { action: "delete-field", actionPayload: { fieldId } },
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
      navigate("/lessons/add?field=" + fieldId);
    }}
  >
    Přidat lekci
  </Button>
  {#each lessons.entries() as [lessonId, lesson]}
    {#if field.lessons.includes(lessonId)}
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
