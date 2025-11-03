<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { goto, pushState } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
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
  import { siteName } from "$lib/config";
  import { getResourceContext } from "$lib/resources";
  import { filter } from "$lib/utils/mapUtils";
  import { createQuery } from "@tanstack/svelte-query";

  const { competences, fields, lessons } = getResourceContext();

  const accountQuery = createQuery<Loginstate>(() => ({
    queryKey: ["v1.0", "account"],
  }));
  let adminOrSuperuser = $derived(
    accountQuery.data?.role === "administrator" ||
      accountQuery.data?.role === "superuser",
  );
</script>

<TopBar />
<MainPageContainer>
  {#if page.state.action?.name === "add-field"}
    <AddFieldPanel />
  {:else if page.state.action?.name === "change-field"}
    {@const field = fields.current?.get(page.state.action.fieldId)}
    {#if field !== undefined}
      <EditFieldPanel {field} fieldId={page.state.action.fieldId} />
    {/if}
  {:else if page.state.action?.name === "delete-field"}
    {@const field = fields.current?.get(page.state.action.fieldId)}
    {#if field !== undefined}
      <DeleteFieldDialog {field} fieldId={page.state.action.fieldId} />
    {/if}
  {:else if page.state.action?.name === "delete-lesson"}
    {@const lesson = lessons.current?.get(page.state.action.lessonId)}
    {#if lesson !== undefined}
      <DeleteLessonDialog {lesson} lessonId={page.state.action.lessonId} />
    {/if}
  {:else if page.state.action?.name === "restore-lesson"}
    <RestoreLessonPanel />
  {/if}

  <h1>{`${siteName} - Lekce`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        pushState("", { action: { name: "add-field" } });
      }}
    >
      Přidat oblast
    </Button>
  {/if}
  <Button
    green
    icon="plus"
    onclick={(): void => {
      void goto(resolve("/lessons/add"));
    }}
  >
    Přidat lekci
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="history"
      onclick={(): void => {
        pushState("", { action: { name: "restore-lesson" } });
      }}
    >
      Smazané lekce
    </Button>
  {/if}
  {@const fieldsValue = fields.current}
  {#if fieldsValue === undefined || lessons.current === undefined || competences.current === undefined}
    <LoadingIndicator />
  {:else}
    {#each filter(lessons.current, (lessonId) => filter( fieldsValue, (_, field) => field.lessons.includes(lessonId), ).size === 0) as [lessonId, lesson] (lessonId)}
      <LessonViewLesson id={lessonId} {lesson} />
    {/each}
    {#each fieldsValue as [fieldId, field] (fieldId)}
      <div>
        <h2>{field.name}</h2>
        {#if adminOrSuperuser}
          <Button
            cyan
            icon="pencil"
            onclick={(): void => {
              pushState("", {
                action: {
                  fieldId,
                  name: "change-field",
                },
              });
            }}
          >
            Upravit
          </Button>
          <Button
            icon="trash-empty"
            onclick={(): void => {
              pushState("", {
                action: {
                  fieldId,
                  name: "delete-field",
                },
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
            void goto(resolve(`/lessons/add?field=${fieldId}`));
          }}
        >
          Přidat lekci
        </Button>
        {#each filter( lessons.current, (lessonId) => field.lessons.includes(lessonId), ) as [lessonId, lesson] (lessonId)}
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
