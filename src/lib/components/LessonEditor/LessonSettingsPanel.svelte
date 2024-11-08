<script lang="ts">
  import { page } from "$app/stores";
  import EditLessonCompetences from "$lib/components/LessonEditor/EditLessonCompetences.svelte";
  import EditLessonField from "$lib/components/LessonEditor/EditLessonField.svelte";
  import EditLessonGroups from "$lib/components/LessonEditor/EditLessonGroups.svelte";
  import LessonSettingsOverview from "$lib/components/LessonEditor/LessonSettingsOverview.svelte";
  import RestoreLessonVersion from "$lib/components/LessonEditor/RestoreLessonVersion.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";

  import type { PageStateFix } from "../../../app";

  let state = $derived($page.state as PageStateFix);

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
