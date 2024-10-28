<script lang="ts" strictEvents>
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Lesson } from "$lib/interfaces/Lesson";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { processCompetences, processLessons } from "$lib/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: {
      competences: Array<[string, Competence]>;
      lessons: Array<[string, Lesson]>;
    };
  }

  const competences = derived(
    createQuery<Record<string, Competence>>({
      queryKey: ["v1.0", "competence"],
    }),
    ({ data, isSuccess }) => (isSuccess ? processCompetences(data) : undefined),
    undefined,
  );

  const lessons = derived(
    [
      createQuery<Record<string, Lesson>>({
        queryKey: ["v1.0", "lesson", { "override-group": true }],
      }),
      competences,
    ],
    ([$lessonQuery, $competences]) =>
      $lessonQuery.isSuccess && $competences !== undefined
        ? processLessons($lessonQuery.data, $competences)
        : undefined,
    undefined,
  );
</script>

{#if $competences !== undefined && $lessons !== undefined}
  <slot competences={$competences} lessons={$lessons} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
