<script lang="ts" strictEvents>
  import type { Group } from "$lib/interfaces/Group";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { processGroups } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  export let silent = false;
  export let inline = false;

  const groups = derived(
    createQuery<Record<string, Group>>({
      queryKey: ["v1.0", "group"],
    }),
    ({ data, isSuccess }) => (isSuccess ? processGroups(data) : undefined),
    undefined,
  );
</script>

{#if $groups !== undefined}
  <slot groups={$groups} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
