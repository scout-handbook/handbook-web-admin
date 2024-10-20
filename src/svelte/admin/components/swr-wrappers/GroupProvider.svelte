<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";

  import type { Group } from "../../../../ts/admin/interfaces/Group";

  import { processGroups } from "../../../../ts/admin/swr";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: { groups: Array<[string, Group]> };
  }

  export let silent = false;
  export let inline = false;

  const groupQuery = createQuery<Record<string, Group>>({
    queryKey: ["v1.0", "group"],
  });
  const { data: rawGroups, isSuccess } = $groupQuery;
</script>

{#if isSuccess}
  <slot groups={processGroups(rawGroups)} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
