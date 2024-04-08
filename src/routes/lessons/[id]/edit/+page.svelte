<script lang="ts" strictEvents>
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import EditLessonView from "$lib/views/EditLessonView.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<FieldProvider let:fields let:lessons>
  <EditLessonView {fields} lessonID={data.id} {lessons} />
</FieldProvider>
