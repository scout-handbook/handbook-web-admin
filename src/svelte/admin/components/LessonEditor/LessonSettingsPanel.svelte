<script lang="ts" strictEvents>
  import { useLocation } from "svelte-navigator";

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
  export let groups: Array<string>;
  export let body: string;

  const location = useLocation();
  $: action = $location.state.action as string;

  refreshLogin();
</script>

{#if action === "restore-version" && id !== null}
  <RestoreLessonVersion lessonId={id} lessonName={name} bind:body />
{:else}
  <SidePanel>
    {#if action === "change-lesson-competences"}
      <ChangeLessonCompetences bind:competences />
    {:else if action === "change-lesson-field"}
      <ChangeLessonField bind:field />
    {:else if action === "change-lesson-groups"}
      <ChangeLessonGroups bind:groups />
    {:else}
      <LessonSettingsOverview {id} {competences} {field} {groups} />
    {/if}
  </SidePanel>
{/if}
