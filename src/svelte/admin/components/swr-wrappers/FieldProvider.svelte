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
  const fields = derived(
    [
      createQuery<Record<string, Field>>({
        queryKey: ["v1.0", "field", { "override-group": true }],
      }),
      lessons,
      competences,
    ],
    ([$fieldQuery, $lessons, $competences]) =>
      $fieldQuery.isSuccess &&
      $lessons !== undefined &&
      $competences !== undefined
        ? processFields($fieldQuery.data, $lessons, $competences)
        : undefined,
    undefined,
  );
</script>

{#if $competences !== undefined && $lessons !== undefined && $fields !== undefined}
  <slot competences={$competences} fields={$fields} lessons={$lessons} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
