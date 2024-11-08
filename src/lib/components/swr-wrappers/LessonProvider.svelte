<script lang="ts">
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { Snippet } from "svelte";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import {
    processCompetences,
    processLessons,
  } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  interface Props {
    children: Snippet<[Array<[string, Competence]>, Array<[string, Lesson]>]>;
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
</script>

{#if $competences !== undefined && $lessons !== undefined}
  {@render children($competences, $lessons)}
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
