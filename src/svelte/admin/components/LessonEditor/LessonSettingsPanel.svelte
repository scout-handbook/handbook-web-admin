<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";
  import ChangeLessonCompetences from "./ChangeLessonCompetences.svelte";
  import ChangeLessonField from "./ChangeLessonField.svelte";
  import ChangeLessonGroups from "./ChangeLessonGroups.svelte";
  import LessonSettingsOverview from "./LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "./RestoreLessonVersion.svelte";

  export let id: string | null;
  export let name: string | null;
  export let competences: Array<string>;
  export let field: string | null;
  export let saveActionQueue: ActionQueue;
  export let body: string;

  const location = useLocation();
  $: action = $location.state?.action as string;

  refreshLogin();
</script>

{#if action === "restore-version"}
  <RestoreLessonVersion lessonId={id} lessonName={name} bind:body />
{:else}
  <SidePanel>
    {#if action === "change-lesson-competences"}
      <ChangeLessonCompetences bind:competences />
    {:else if action === "change-lesson-field"}
      <ChangeLessonField bind:field />
    {:else if action === "change-lesson-groups"}
      <ChangeLessonGroups {id} {saveActionQueue} />
    {:else}
      <LessonSettingsOverview {id} {competences} {field} />
    {/if}
  </SidePanel>
{/if}
