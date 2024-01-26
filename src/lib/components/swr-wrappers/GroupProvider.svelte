<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import type { Group } from "$lib/interfaces/Group";
  import { processGroups } from "$lib/swr";
  import { constructURL } from "$lib/utils/constructURL";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  export let silent = false;
  export let inline = false;

  const groups = derived(
    useSWR<Record<string, Group>>(constructURL("v1.0/group")).data,
    processGroups,
    undefined,
  );
</script>

{#if $groups === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot groups={$groups} />
{/if}
