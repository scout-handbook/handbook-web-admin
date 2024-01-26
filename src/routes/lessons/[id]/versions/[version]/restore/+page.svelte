<script lang="ts" strictEvents>
  import RestoreLessonView from "$lib/views/RestoreLessonView.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<RestoreLessonView lessonID={data.id} version={data.version} />
