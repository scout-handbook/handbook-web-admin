import type { Group } from "$lib/interfaces/Group";

import { queryClient } from "$lib/utils/queryClient";
import { createQuery } from "@tanstack/svelte-query";
import { SvelteMap } from "svelte/reactivity";
import { derived, fromStore } from "svelte/store";

export const groups = fromStore(
  derived(
    createQuery<Record<string, Group>>(
      {
        queryKey: ["v1.0", "group"],
      },
      queryClient,
    ),
    ({ data, isSuccess }) =>
      isSuccess
        ? new SvelteMap<string, Group>(Object.entries(data))
        : undefined,
    undefined,
  ),
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
