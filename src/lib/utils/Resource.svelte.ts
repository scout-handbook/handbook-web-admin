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
    comparator: (a: [string, T], b: [string, T]) => number,
  ) {
    this.query = query;
    this.sorted = $derived(
      this.query.data !== undefined
        ? new SvelteMap(Object.entries(this.query.data).sort(comparator))
        : undefined,
    );
  }
}
