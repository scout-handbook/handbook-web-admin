<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { siteName } from "../../../ts/admin/stores";
  import { get } from "../../../ts/admin/utils/arrayUtils";
  import AddFieldPanel from "../components/action-modals/AddFieldPanel.svelte";
  import DeleteFieldDialog from "../components/action-modals/DeleteFieldDialog.svelte";
  import DeleteLessonDialog from "../components/action-modals/DeleteLessonDialog.svelte";
  import EditFieldPanel from "../components/action-modals/EditFieldPanel.svelte";
  import RestoreLessonPanel from "../components/action-modals/RestoreLessonPanel.svelte";
  import Button from "../components/Button.svelte";
  import LessonViewLesson from "../components/LessonViewLesson.svelte";
  import FieldProvider from "../components/swr-wrappers/FieldProvider.svelte";
  import LessonProvider from "../components/swr-wrappers/LessonProvider.svelte";

  const navigate = useNavigate();
  const location = useLocation<{
    action: string;
    actionPayload: {
      fieldId: string;
      lessonId: string;
    };
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: actionPayload = $location.state?.actionPayload;

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
</script>

{#if action === "add-field"}
  <AddFieldPanel />
{:else if action === "change-field"}
  <FieldProvider silent let:fields>
    {@const field = get(fields, actionPayload.fieldId)}
    {#if field !== undefined}
      <!-- TODO: This is too slow for some reason -->
      <EditFieldPanel {field} fieldId={actionPayload.fieldId} />
    {/if}
  </FieldProvider>
{:else if action === "delete-field"}
  <FieldProvider silent let:fields>
    {@const field = get(fields, actionPayload.fieldId)}
    {#if field !== undefined}
      <DeleteFieldDialog {field} fieldId={actionPayload.fieldId} />
    {/if}
  </FieldProvider>
{:else if action === "delete-lesson"}
  <LessonProvider silent let:lessons>
    {@const lesson = get(lessons, actionPayload.lessonId)}
    {#if lesson !== undefined}
      <DeleteLessonDialog {lesson} lessonId={actionPayload.lessonId} />
    {/if}
  </LessonProvider>
{:else if action === "restore-lesson"}
  <RestoreLessonPanel />
{/if}

<h1>{`${$siteName} - Lekce`}</h1>
{#if adminOrSuperuser}
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
{#if adminOrSuperuser}
  <Button
    icon="history"
    on:click={() => {
      navigate("/lessons", { state: { action: "restore-lesson" } });
    }}
  >
    Smazané lekce
  </Button>
{/if}
<FieldProvider let:fields let:lessons>
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
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- It's a string, but TS doesn't work in templates
          navigate(`/lessons/add?field=${fieldId}`);
        }}
      >
        Přidat lekci
      </Button>
      {#each lessons as [lessonId, lesson] (lessonId)}
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
