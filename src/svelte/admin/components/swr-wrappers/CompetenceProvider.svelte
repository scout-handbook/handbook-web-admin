<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { processCompetences } from "../../../../ts/admin/swr";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: { competences: Array<[string, Competence]> };
  }

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );
</script>

{#if $competences === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot competences={$competences} />
{/if}
