import type { CreateQueryResult } from "@tanstack/svelte-query";

import { SvelteMap } from "svelte/reactivity";

export class Resource<T> {
  public get current(): SvelteMap<string, T> | undefined {
    return this.sorted;
  }

  private readonly query: CreateQueryResult<Record<string, T>>;

  private readonly sorted: SvelteMap<string, T> | undefined;

  public constructor(
    query: CreateQueryResult<Record<string, T>>,
    comparator: (a: T, b: T) => number,
  ) {
    this.query = query;
    this.sorted = $derived(
      this.query.data !== undefined
        ? new SvelteMap(
            Object.entries(this.query.data).sort((a, b) =>
              comparator(a[1], b[1]),
            ),
          )
        : undefined,
    );
  }
}
