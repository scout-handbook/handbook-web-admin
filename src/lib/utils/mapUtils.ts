import { SvelteMap } from "svelte/reactivity";

export function filter<K, V>(
  mp: SvelteMap<K, V>,
  fn: (key: K, value: V) => boolean,
): SvelteMap<K, V> {
  return new SvelteMap([...mp].filter(([key, value]) => fn(key, value)));
}

export function find<K, V>(
  mp: SvelteMap<K, V>,
  fn: (value: V) => boolean,
): [K, V] | undefined {
  return [...mp].find(([_, value]) => fn(value));
}

export function map<K, V1, V2>(
  mp: SvelteMap<K, V1>,
  fn: (key: K, value: V1) => [K, V2],
): SvelteMap<K, V2> {
  return new SvelteMap([...mp].map(([key, value]) => fn(key, value)));
}
