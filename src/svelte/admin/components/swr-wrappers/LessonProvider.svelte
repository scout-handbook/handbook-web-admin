<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import { processCompetences, processLessons } from "../../../../ts/admin/swr";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: {
      competences: Array<[string, Competence]>;
      lessons: Array<[string, Lesson]>;
    };
  }

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );
  const lessons = derived(
    [
      useSWR<Record<string, Lesson>>(
        constructURL("v1.0/lesson?override-group=true")
      ).data,
      competences,
    ],
    processLessons,
    undefined
  );
</script>

{#if $competences === undefined || $lessons === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot competences={$competences} lessons={$lessons} />
{/if}
