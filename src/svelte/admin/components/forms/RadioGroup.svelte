<script lang="ts" strictEvents>
  // eslint-disable-next-line no-undef
  type KeyType = $$Generic<number | string>;
  // eslint-disable-next-line no-undef
  type ValueType = $$Generic;

  interface $$Slots {
    option: { id: KeyType; value: ValueType };
  }

  export let options: Array<[KeyType, ValueType]>;
  export let selected: KeyType | null;

  const name = Math.random().toString();
</script>

{#each options as [id, value]}
  <div class="form-row">
    <label class="form-switch">
      <input {name} type="radio" value={id} bind:group={selected} />
      <span class="form-custom form-radio" />
      <slot {id} name="option" {value} />
    </label>
  </div>
{/each}
