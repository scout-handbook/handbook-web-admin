<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

{#if action === "add-field"}
  <AddFieldPanel />
{:else if action === "change-field"}
  <FieldProvider silent let:fields>
    <EditFieldPanel {fields} payload={actionPayload} />
    <!-- TODO: This is too slow for some reason -->
  </FieldProvider>
{:else if action === "delete-field"}
  <FieldProvider silent let:fields>
    <DeleteFieldDialog {fields} payload={actionPayload} />
  </FieldProvider>
{:else if action === "delete-lesson"}
  <LessonProvider silent let:lessons>
    <DeleteLessonDialog {lessons} payload={actionPayload} />
  </LessonProvider>
{:else if action === "restore-lesson"}
  <RestoreLessonPanel />
{/if}

<h1>{$siteName + " - Lekce"}</h1>
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
  <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-return -->
  {#each lessons.filter(([lessonId, _]) => fields.filter( ([_, field]) => field.lessons.includes(lessonId) ).length === 0) as [lessonId, lesson]}
    <LessonViewLesson id={lessonId} {lesson} />
  {/each}
  {#each fields as [fieldId, field]}
    <br />
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
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        navigate("/lessons/add?field=" + fieldId);
      }}
    >
      Přidat lekci
    </Button>
    {#each lessons as [lessonId, lesson]}
      <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call -->
      {#if field.lessons.includes(lessonId)}
        <LessonViewLesson id={lessonId} {lesson} secondLevel={true} />
      {/if}
    {/each}
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
