<div></div>
<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { showLessonAddView } from "../../ts/admin/views/addLesson"

  const location = useLocation();

  console.log($location);

  const fieldID: string|undefined = undefined;
  showLessonAddView(fieldID);
</script>
