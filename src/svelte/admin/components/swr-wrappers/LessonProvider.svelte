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

  const competenceQuery = createQuery<Record<string, Competence>>({
    queryKey: ["v1.0", "competence"],
  });
  const { data: rawCompetences, isSuccess: competenceIsSuccess } =
    $competenceQuery;

  const lessons = derived(
    [
      createQuery<Record<string, Lesson>>({
        queryKey: ["v1.0", "lesson", { "override-group": true }],
      }),
      competenceQuery,
    ],
    ([lessonQuery, $competenceQuery]) =>
      $competenceQuery.isSuccess
        ? processLessons([
            lessonQuery.data,
            // TODO: Deduplicate
            processCompetences($competenceQuery.data),
          ])
        : undefined,
    undefined,
  );
</script>

{#if competenceIsSuccess && $lessons !== undefined}
  <slot competences={processCompetences(rawCompetences)} lessons={$lessons} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
