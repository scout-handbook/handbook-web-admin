<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { processGroups } from "../../../../ts/admin/swr";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  export let silent = false;
  export let inline = false;

  const groups = derived(
    useSWR<Record<string, Group>>(constructURL("v1.0/group")).data,
    processGroups,
    undefined
  );
</script>

{#if $groups === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot groups={$groups} />
{/if}
