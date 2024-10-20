<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";

  import { processCompetences, processLessons } from "../../../../ts/admin/swr";
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
    createQuery<Record<string, Competence>>({
      queryKey: ["v1.0", "competence"],
    }),
    (competenceQuery) => processCompetences(competenceQuery.data),
    undefined,
  );
  const lessons = derived(
    [
      createQuery<Record<string, Lesson>>({
        queryKey: ["v1.0", "lesson", { "override-group": true }],
      }),
      competences,
    ],
    ([lessonQuery, $competences]) =>
      processLessons([lessonQuery.data, $competences]),
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
