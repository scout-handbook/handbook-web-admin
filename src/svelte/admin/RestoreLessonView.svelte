<div></div>
<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { showLessonRestoreView } from "../../ts/admin/views/restoreLesson"

  export let lesson: string;
  export let version: string;

  const location = useLocation();

  const name = (new URLSearchParams($location.search)).get("name");
  showLessonRestoreView(lesson, version, name);
</script>
