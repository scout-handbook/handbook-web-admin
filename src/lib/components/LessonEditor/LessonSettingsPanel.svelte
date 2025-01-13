<script lang="ts">
  import { page } from "$app/state";
  import EditLessonCompetences from "$lib/components/LessonEditor/EditLessonCompetences.svelte";
  import EditLessonField from "$lib/components/LessonEditor/EditLessonField.svelte";
  import EditLessonGroups from "$lib/components/LessonEditor/EditLessonGroups.svelte";
  import LessonSettingsOverview from "$lib/components/LessonEditor/LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "$lib/components/LessonEditor/RestoreLessonVersion.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";

  interface Props {
    body: string;
    competences: Array<string>;
    field: string | null;
    groups: Array<string>;
    id: string | null;
    name: string | null;
  }

  let {
    body = $bindable(),
    competences = $bindable(),
    field = $bindable(),
    groups = $bindable(),
    id,
    name = $bindable(),
  }: Props = $props();
</script>

{#if page.state.action?.name === "restore-version" && id !== null && name !== null}
  <RestoreLessonVersion lessonId={id} bind:lessonName={name} bind:body />
{:else}
  <SidePanel>
    {#if page.state.action?.name === "change-lesson-competences"}
      <EditLessonCompetences bind:competences />
    {:else if page.state.action?.name === "change-lesson-field"}
      <EditLessonField bind:field />
    {:else if page.state.action?.name === "change-lesson-groups"}
      <EditLessonGroups bind:groups />
    {:else}
      <LessonSettingsOverview {id} {competences} {field} {groups} />
    {/if}
  </SidePanel>
{/if}
