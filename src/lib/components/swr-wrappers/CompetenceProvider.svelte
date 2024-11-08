<script lang="ts">
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Snippet } from "svelte";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { processCompetences } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  interface Props {
    children: Snippet<[Array<[string, Competence]>]>;
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
</script>

{#if $competences !== undefined}
  {@render children($competences)}
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
