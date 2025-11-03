<script lang="ts">
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import EditLessonPage from "$lib/EditLessonPage.svelte";
  import { getResourceContext } from "$lib/resources";

  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const { fields, lessons } = getResourceContext();
</script>

{#if fields.current === undefined || lessons.current === undefined}
  <LoadingIndicator />
{:else}
  <EditLessonPage
    fields={fields.current}
    lessonID={data.id}
    lessons={lessons.current}
  />
{/if}
