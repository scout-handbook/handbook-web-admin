<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";

  import {
    processCompetences,
    processFields,
    processLessons,
  } from "../../../../ts/admin/swr";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: {
      competences: Array<[string, Competence]>;
      fields: Array<[string, Field]>;
      lessons: Array<[string, Lesson]>;
    };
  }

  export let silent = false;
  export let inline = false;

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
  const fields = derived(
    [
      createQuery<Record<string, Field>>({
        queryKey: ["v1.0", "field", { "override-group": true }],
      }),
      lessons,
      competenceQuery,
    ],
    ([fieldQuery, $lessons, $competenceQuery]) =>
      $competenceQuery.isSuccess
        ? processFields([
            fieldQuery.data,
            $lessons,
            // TODO: Deduplicate
            processCompetences($competenceQuery.data),
          ])
        : undefined,
    undefined,
  );
</script>

{#if competenceIsSuccess && $lessons !== undefined && $fields !== undefined}
  <slot
    competences={processCompetences(rawCompetences)}
    fields={$fields}
    lessons={$lessons}
  />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
