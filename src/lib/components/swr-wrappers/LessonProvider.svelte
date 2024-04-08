<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import { processCompetences, processLessons } from "$lib/swr";
  import { constructURL } from "$lib/utils/constructURL";

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
    undefined,
  );
  const lessons = derived(
    [
      useSWR<Record<string, Lesson>>(
        constructURL("v1.0/lesson?override-group=true"),
      ).data,
      competences,
    ],
    processLessons,
    undefined,
  );
</script>

{#if $competences === undefined || $lessons === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot competences={$competences} lessons={$lessons} />
{/if}
