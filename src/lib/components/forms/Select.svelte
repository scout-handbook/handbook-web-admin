<script generics="KeyType extends number | string, ValueType" lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Props {
    options: Array<[KeyType, ValueType]>;
    selected: KeyType | null;
  }

  let { options, selected = $bindable() }: Props = $props();

  const dispatch = createEventDispatcher<{ change: null }>();
</script>

<select
  onchange={() => {
    dispatch("change");
  }}
  bind:value={selected}
>
  {#each options as [id, value] (id)}
    <option value={id}>{value}</option>
  {/each}
</select>

<style>
  select {
    margin-right: 10px;
    background-color: var(--background-darker);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-size: 1em;
    padding: 2px 10px;
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
  }

  select:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }
</style>
