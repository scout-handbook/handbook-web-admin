<script lang="ts" strictEvents>
  // eslint-disable-next-line no-undef
  type KeyType = $$Generic<number | string>;
  // eslint-disable-next-line no-undef
  type ValueType = $$Generic;

  export let options: Array<[KeyType, ValueType]>;
  export let selected: KeyType | null;
</script>

<select class="form-select filter-select" bind:value={selected}>
  {#each options as [id, value]}
    <option value={id}>{value}</option>
  {/each}
</select>

<style>
  .filter-select {
    margin-right: 10px;
  }
</style>
