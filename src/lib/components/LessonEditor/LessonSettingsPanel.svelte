<script lang="ts" strictEvents>
  import { page } from "$app/stores";
  import EditLessonCompetences from "$lib/components/LessonEditor/EditLessonCompetences.svelte";
  import EditLessonField from "$lib/components/LessonEditor/EditLessonField.svelte";
  import EditLessonGroups from "$lib/components/LessonEditor/EditLessonGroups.svelte";
  import LessonSettingsOverview from "$lib/components/LessonEditor/LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "$lib/components/LessonEditor/RestoreLessonVersion.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";

  import type { PageStateFix } from "../../../app";

  $: state = $page.state as PageStateFix;

  export let id: string | null;
  export let name: string | null;
  export let competences: Array<string>;
  export let field: string | null;
  export let groups: Array<string>;
  export let body: string;
</script>

{#if state.action === "restore-version" && id !== null && name !== null}
  <RestoreLessonVersion lessonId={id} bind:lessonName={name} bind:body />
{:else}
  <SidePanel>
    {#if state.action === "change-lesson-competences"}
      <EditLessonCompetences bind:competences />
    {:else if state.action === "change-lesson-field"}
      <EditLessonField bind:field />
    {:else if state.action === "change-lesson-groups"}
      <EditLessonGroups bind:groups />
    {:else}
      <LessonSettingsOverview {id} {competences} {field} {groups} />
    {/if}
  </SidePanel>
{/if}
