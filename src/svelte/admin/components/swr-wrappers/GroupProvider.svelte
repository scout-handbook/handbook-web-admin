<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  import type { Group } from "../../../../ts/admin/interfaces/Group";

  import { processGroups } from "../../../../ts/admin/swr";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  export let silent = false;
  export let inline = false;

  const groups = derived(
    createQuery<Record<string, Group>>({
      queryKey: ["v1.0", "group"],
    }),
    (groupQuery) => processGroups(groupQuery.data),
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
