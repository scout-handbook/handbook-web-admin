<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import type { Competence } from "$lib/interfaces/Competence";
  import { processCompetences } from "$lib/swr";
  import { constructURL } from "$lib/utils/constructURL";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: { competences: Array<[string, Competence]> };
  }

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined,
  );
</script>

{#if $competences === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot competences={$competences} />
{/if}
