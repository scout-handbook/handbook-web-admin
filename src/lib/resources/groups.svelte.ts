import type { Group } from "$lib/interfaces/Group";

import { queryClient } from "$lib/utils/queryClient";
import { Resource } from "$lib/utils/Resource.svelte";
import { createQuery } from "@tanstack/svelte-query";

function groupComparator(first: Group, second: Group): number {
  return first.name.localeCompare(second.name);
}

export const groups = new Resource<Group>(
  createQuery<Record<string, Group>>(
    () => ({
      queryKey: ["v1.0", "group"],
    }),
    () => queryClient,
  ),
  groupComparator,
);
