<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import AddFieldPanel from "$lib/components/action-modals/AddFieldPanel.svelte";
  import DeleteFieldDialog from "$lib/components/action-modals/DeleteFieldDialog.svelte";
  import DeleteLessonDialog from "$lib/components/action-modals/DeleteLessonDialog.svelte";
  import EditFieldPanel from "$lib/components/action-modals/EditFieldPanel.svelte";
  import RestoreLessonPanel from "$lib/components/action-modals/RestoreLessonPanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import LessonViewLesson from "$lib/components/LessonViewLesson.svelte";
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import LessonProvider from "$lib/components/swr-wrappers/LessonProvider.svelte";
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import { siteName } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";

  import type { PageStateFix } from "../../app";

  $: state = $page.state as PageStateFix;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

{#if state.action === "add-field"}
  <AddFieldPanel />
{:else if state.action === "change-field"}
  <FieldProvider silent let:fields>
    <EditFieldPanel {fields} payload={state.actionPayload} />
    <!-- TODO: This is too slow for some reason -->
  </FieldProvider>
{:else if state.action === "delete-field"}
  <FieldProvider silent let:fields>
    <DeleteFieldDialog {fields} payload={state.actionPayload} />
  </FieldProvider>
{:else if state.action === "delete-lesson"}
  <LessonProvider silent let:lessons>
    <DeleteLessonDialog {lessons} payload={state.actionPayload} />
  </LessonProvider>
{:else if state.action === "restore-lesson"}
  <RestoreLessonPanel />
{/if}

<h1>{$siteName + " - Lekce"}</h1>
{#if adminOrSuperuser}
  <Button
    green
    icon="plus"
    on:click={() => {
      void goto(base + "/lessons", { state: { action: "add-field" } });
    }}
  >
    Přidat oblast
  </Button>
{/if}
<Button
  green
  icon="plus"
  on:click={() => {
    void goto(base + "/lessons/add");
  }}
>
  Přidat lekci
</Button>
{#if adminOrSuperuser}
  <Button
    icon="history"
    on:click={() => {
      void goto(base + "/lessons", { state: { action: "restore-lesson" } });
    }}
  >
    Smazané lekce
  </Button>
{/if}
<FieldProvider let:fields let:lessons>
  <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-return -->
  {#each lessons.filter(([lessonId, _1]) => fields.filter( ([_2, field]) => field.lessons.includes(lessonId), ).length === 0) as [lessonId, lesson] (lessonId)}
    <LessonViewLesson id={lessonId} {lesson} />
  {/each}
  {#each fields as [fieldId, field] (fieldId)}
    <div>
      <h2>{field.name}</h2>
      {#if adminOrSuperuser}
        <Button
          cyan
          icon="pencil"
          on:click={() => {
            void goto(base + "/lessons", {
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
            void goto(base + "/lessons", {
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
          void goto(base + "/lessons/add?field=" + fieldId);
        }}
      >
        Přidat lekci
      </Button>
      {#each lessons as [lessonId, lesson] (lessonId)}
        <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call -->
        {#if field.lessons.includes(lessonId)}
          <LessonViewLesson id={lessonId} {lesson} secondLevel={true} />
        {/if}
      {/each}
    </div>
  {/each}
</FieldProvider>

<style>
  h2 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 2.3em;
  }
</style>
