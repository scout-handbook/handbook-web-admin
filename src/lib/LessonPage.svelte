<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { goto, pushState } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import AddFieldPanel from "$lib/components/action-modals/AddFieldPanel.svelte";
  import DeleteFieldDialog from "$lib/components/action-modals/DeleteFieldDialog.svelte";
  import DeleteLessonDialog from "$lib/components/action-modals/DeleteLessonDialog.svelte";
  import EditFieldPanel from "$lib/components/action-modals/EditFieldPanel.svelte";
  import RestoreLessonPanel from "$lib/components/action-modals/RestoreLessonPanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import LessonViewLesson from "$lib/components/LessonViewLesson.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { competences } from "$lib/resources/competences.svelte";
  import { fields, sortFields } from "$lib/resources/fields.svelte";
  import { lessons, sortLessons } from "$lib/resources/lessons.svelte";
  import { filter } from "$lib/utils/mapUtils";
  import { createQuery } from "@tanstack/svelte-query";

  import type { PageStateFix } from "../app";

  let state = $derived($page.state as PageStateFix);

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
</script>

<TopBar />
<MainPageContainer>
  {#if state.action === "add-field"}
    <AddFieldPanel />
  {:else if state.action === "change-field"}
    {@const field = fields.current?.get(state.actionPayload.fieldId)}
    {#if field !== undefined}
      <EditFieldPanel {field} fieldId={state.actionPayload.fieldId} />
    {/if}
  {:else if state.action === "delete-field"}
    {@const field = fields.current?.get(state.actionPayload.fieldId)}
    {#if field !== undefined}
      <DeleteFieldDialog {field} fieldId={state.actionPayload.fieldId} />
    {/if}
  {:else if state.action === "delete-lesson"}
    {@const lesson = lessons.current?.get(state.actionPayload.lessonId)}
    {#if lesson !== undefined}
      <DeleteLessonDialog {lesson} lessonId={state.actionPayload.lessonId} />
    {/if}
  {:else if state.action === "restore-lesson"}
    <RestoreLessonPanel />
  {/if}

  <h1>{`${CONFIG["site-name"]} - Lekce`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        pushState("", { action: "add-field" });
      }}
    >
      Přidat oblast
    </Button>
  {/if}
  <Button
    green
    icon="plus"
    onclick={(): void => {
      void goto(`${base}/lessons/add`);
    }}
  >
    Přidat lekci
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="history"
      onclick={(): void => {
        pushState("", { action: "restore-lesson" });
      }}
    >
      Smazané lekce
    </Button>
  {/if}
  {@const fieldsValue = fields.current}
  {#if fieldsValue === undefined || lessons.current === undefined || competences.current === undefined}
    <LoadingIndicator />
  {:else}
    {#each sortLessons( filter(lessons.current, (lessonId) => filter( fieldsValue, (_, field) => field.lessons.includes(lessonId), ).size === 0), competences.current, ) as [lessonId, lesson] (lessonId)}
      <LessonViewLesson id={lessonId} {lesson} />
    {/each}
    {#each sortFields(fieldsValue, lessons.current, competences.current) as [fieldId, field] (fieldId)}
      <div>
        <h2>{field.name}</h2>
        {#if adminOrSuperuser}
          <Button
            cyan
            icon="pencil"
            onclick={(): void => {
              pushState("", {
                action: "change-field",
                actionPayload: { fieldId },
              });
            }}
          >
            Upravit
          </Button>
          <Button
            icon="trash-empty"
            onclick={(): void => {
              pushState("", {
                action: "delete-field",
                actionPayload: { fieldId },
              });
            }}
            red
          >
            Smazat
          </Button>
        {/if}
        <Button
          green
          icon="plus"
          onclick={(): void => {
            void goto(`${base}/lessons/add?field=${fieldId}`);
          }}
        >
          Přidat lekci
        </Button>
        {#each sortLessons( filter( lessons.current, (lessonId) => field.lessons.includes(lessonId), ), competences.current, ) as [lessonId, lesson] (lessonId)}
          <LessonViewLesson id={lessonId} {lesson} secondLevel={true} />
        {/each}
      </div>
    {/each}
  {/if}
</MainPageContainer>

<style>
  h2 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 2.3em;
  }
</style>
