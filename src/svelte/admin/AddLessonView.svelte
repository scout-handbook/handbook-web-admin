<div></div>
<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { showLessonAddView } from "../../ts/admin/views/addLesson"

  const location = useLocation();

  const fieldID = (new URLSearchParams($location.search)).get("field");
  showLessonAddView(fieldID);
</script>
