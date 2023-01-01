<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import ChangeLessonCompetences from "./ChangeLessonCompetences.svelte";
  import ChangeLessonField from "./ChangeLessonField.svelte";
  import ChangeLessonGroups from "./ChangeLessonGroups.svelte";
  import LessonSettingsOverview from "./LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "./RestoreLessonVersion.svelte";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";

  export let lessonId: string | null;
  export let lessonName: string | null;
  export let saveActionQueue: ActionQueue;

  const location = useLocation();
  $: action = $location.state?.action;

  refreshLogin();
</script>

{#if action === "restore-version"}
  <RestoreLessonVersion {lessonId} {lessonName} />
{:else}
  <SidePanel>
    {#if action === "change-lesson-competences"}
      <ChangeLessonCompetences {lessonId} {saveActionQueue} />
    {:else if action === "change-lesson-field"}
      <ChangeLessonField {lessonId} {saveActionQueue} />
    {:else if action === "change-lesson-groups"}
      <ChangeLessonGroups {lessonId} {saveActionQueue} />
    {:else}
      <LessonSettingsOverview {lessonId} />
    {/if}
  </SidePanel>
{/if}
