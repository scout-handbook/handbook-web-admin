<script lang="ts">
  import type { Group } from "$lib/interfaces/Group";
  import type { Snippet } from "svelte";

  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { processGroups } from "$lib/utils/resourceProcessing";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  interface Props {
    children: Snippet<[Array<[string, Group]>]>;
    inline?: boolean;
    silent?: boolean;
  }

  let { children, inline = false, silent = false }: Props = $props();

  const groups = derived(
    createQuery<Record<string, Group>>({
      queryKey: ["v1.0", "group"],
    }),
    ({ data, isSuccess }) => (isSuccess ? processGroups(data) : undefined),
    undefined,
  );
</script>

{#if $groups !== undefined}
  {@render children($groups)}
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
