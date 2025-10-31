import type { Group } from "$lib/interfaces/Group";

import { queryClient } from "$lib/utils/queryClient";
import { Resource } from "$lib/utils/Resource.svelte";
import { createQuery } from "@tanstack/svelte-query";

export const groups = new Resource<Group>(
  createQuery<Record<string, Group>>(
    () => ({
      queryKey: ["v1.0", "group"],
    }),
    () => queryClient,
  ),
  (a, b) => a[1].name.localeCompare(b[1].name),
);
