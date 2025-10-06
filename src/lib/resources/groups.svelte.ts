import type { Group } from "$lib/interfaces/Group";

import { queryClient } from "$lib/utils/queryClient";
import { createQuery } from "@tanstack/svelte-query";
import { SvelteMap } from "svelte/reactivity";

const groupQuery = createQuery<Record<string, Group>>(
  () => ({
    queryKey: ["v1.0", "group"],
  }),
  () => queryClient,
);

export const groups = $derived(
  groupQuery.isSuccess
    ? new SvelteMap<string, Group>(Object.entries(groupQuery.data))
    : undefined,
);

export function sortGroups(
  unsortedGroups: SvelteMap<string, Group>,
): SvelteMap<string, Group> {
  return new SvelteMap(
    [...unsortedGroups].sort((first, second) =>
      first[1].name.localeCompare(second[1].name),
    ),
  );
}
