<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  import type { Group } from "../../../../ts/admin/interfaces/Group";

  import { processGroups } from "../../../../ts/admin/resourceProcessing";
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
    ({ data, isSuccess }) => (isSuccess ? processGroups(data) : undefined),
    undefined,
  );
</script>

{#if $groups !== undefined}
  <slot groups={$groups} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
