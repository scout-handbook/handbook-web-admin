<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { processGroups } from "../../../../ts/admin/metadata";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  const groups = derived(
    useSWR<Record<string, Group>>(constructURL("v1.0/group")).data,
    processGroups,
    undefined
  );
</script>

{#if $groups === undefined}
  <LoadingIndicator />
{:else}
  <slot groups={$groups} />
{/if}
