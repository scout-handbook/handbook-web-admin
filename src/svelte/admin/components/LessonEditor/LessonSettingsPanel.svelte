<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import ChangeLessonField from "./ChangeLessonField.svelte";
  import LessonSettingsOverview from "./LessonSettingsOverview.svelte";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";

  export let lessonId: string | null;
  export let saveActionQueue: ActionQueue;

  const location = useLocation();
  $: action = $location.state?.action;

  refreshLogin();
</script>

<SidePanel>
  {#if action === "change-lesson-field"}
    <ChangeLessonField {lessonId} {saveActionQueue} />
  {:else}
    <LessonSettingsOverview {lessonId} {saveActionQueue} />
  {/if}
</SidePanel>
