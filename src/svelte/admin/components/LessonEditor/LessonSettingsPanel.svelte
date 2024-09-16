<script lang="ts" strictEvents>
  import { useLocation } from "svelte-navigator";

  import SidePanel from "../SidePanel.svelte";
  import EditLessonCompetences from "./EditLessonCompetences.svelte";
  import EditLessonField from "./EditLessonField.svelte";
  import EditLessonGroups from "./EditLessonGroups.svelte";
  import LessonSettingsOverview from "./LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "./RestoreLessonVersion.svelte";

  export let id: string | null;
  export let name: string | null;
  export let competences: Array<string>;
  export let field: string | null;
  export let groups: Array<string>;
  export let body: string;

  const location = useLocation<{ action: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: action = $location.state?.action;
</script>

{#if action === "restore-version" && id !== null && name !== null}
  <RestoreLessonVersion lessonId={id} bind:lessonName={name} bind:body />
{:else}
  <SidePanel>
    {#if action === "change-lesson-competences"}
      <EditLessonCompetences bind:competences />
    {:else if action === "change-lesson-field"}
      <EditLessonField bind:field />
    {:else if action === "change-lesson-groups"}
      <EditLessonGroups bind:groups />
    {:else}
      <LessonSettingsOverview {id} {competences} {field} {groups} />
    {/if}
  </SidePanel>
{/if}
