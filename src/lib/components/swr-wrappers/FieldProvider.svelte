<script lang="ts">
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { Snippet } from "svelte";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import {
    processCompetences,
    processFields,
    processLessons,
  } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  interface Props {
    children: Snippet<
      [
        Array<[string, Competence]>,
        Array<[string, Field]>,
        Array<[string, Lesson]>,
      ]
    >;
    inline?: boolean;
    silent?: boolean;
  }

  let { children, inline = false, silent = false }: Props = $props();

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
  {@render children($competences, $fields, $lessons)}
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
