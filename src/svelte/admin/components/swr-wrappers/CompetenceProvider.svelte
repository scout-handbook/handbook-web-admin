<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";

  import { processCompetences } from "../../../../ts/admin/resourceProcessing";
  import LoadingIndicator from "../LoadingIndicator.svelte";

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
