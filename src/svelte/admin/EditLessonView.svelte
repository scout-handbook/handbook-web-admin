<div></div>
<script lang="ts">
  import { showLessonEditView } from "../../ts/admin/views/editLesson"

  export let lesson: string;
  console.log(lesson);

  showLessonEditView(lesson);
</script>
