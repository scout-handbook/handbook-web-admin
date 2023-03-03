<script lang="ts" strictEvents>
  // eslint-disable-next-line no-undef
  type KeyType = $$Generic<number | string>;
  // eslint-disable-next-line no-undef
  type ValueType = $$Generic;

  export let options: Array<[KeyType, ValueType]>;
  export let selected: KeyType | null;
</script>

<select bind:value={selected}>
  {#each options as [id, value]}
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
    transition: border-color ease 0.15s, background-color ease 0.15s;
  }

  select:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }
</style>
