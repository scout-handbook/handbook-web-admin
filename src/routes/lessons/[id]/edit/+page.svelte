<script lang="ts" strictEvents>
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import EditLessonPage from "$lib/EditLessonPage.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<FieldProvider let:fields let:lessons>
  <EditLessonPage {fields} lessonID={data.id} {lessons} />
</FieldProvider>
