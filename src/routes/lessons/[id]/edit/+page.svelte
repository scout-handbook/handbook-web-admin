<script lang="ts">
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import EditLessonPage from "$lib/EditLessonPage.svelte";

  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<FieldProvider>
  {#snippet children(_, fields, lessons)}
    <EditLessonPage {fields} lessonID={data.id} {lessons} />
  {/snippet}
</FieldProvider>
