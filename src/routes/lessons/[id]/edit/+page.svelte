<script lang="ts">
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import EditLessonPage from "$lib/EditLessonPage.svelte";
  import { fields } from "$lib/resources/fields.svelte";
  import { lessons } from "$lib/resources/lessons";

  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

{#if fields.current === undefined || $lessons === undefined}
  <LoadingIndicator />
{:else}
  <EditLessonPage
    fields={fields.current}
    lessonID={data.id}
    lessons={$lessons}
  />
{/if}
