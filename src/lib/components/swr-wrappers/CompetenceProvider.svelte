<script lang="ts" strictEvents>
  import type { Competence } from "$lib/interfaces/Competence";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { processCompetences } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: { competences: Array<[string, Competence]> };
  }

  const competences = derived(
    createQuery<Record<string, Competence>>({
      queryKey: ["v1.0", "competence"],
    }),
    ({ data, isSuccess }) => (isSuccess ? processCompetences(data) : undefined),
    undefined,
  );
</script>

{#if $competences !== undefined}
  <slot competences={$competences} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
