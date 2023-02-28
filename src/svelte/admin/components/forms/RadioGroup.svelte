<script lang="ts" strictEvents>
  // eslint-disable-next-line no-undef
  type KeyType = $$Generic<number | string>;
  // eslint-disable-next-line no-undef
  type ValueType = $$Generic;

  interface $$Slots {
    nullOption: Record<string, never>;
    option: { id: KeyType; value: ValueType };
  }

  export let options: Array<[KeyType, ValueType]>;
  export let selected: KeyType | null;

  const name = Math.random().toString();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  $: nullOptionPresent = $$slots.nullOption;
</script>

{#if nullOptionPresent}
  <div class="form-row">
    <label>
      <input {name} type="radio" value={null} bind:group={selected} />
      <span class="form-custom" />
      <slot name="nullOption" />
    </label>
  </div>
{/if}
{#each options as [id, value]}
  <div class="form-row">
    <label>
      <input {name} type="radio" value={id} bind:group={selected} />
      <span class="form-custom" />
      <slot {id} name="option" {value} />
    </label>
  </div>
{/each}

<style>
  input {
    display: none;
  }

  span {
    border-radius: 8px;
  }

  span::before {
    background-color: var(--border-color);
    border-radius: 4px;
    height: 7px;
    margin-left: 4px;
    margin-top: 4px;
    transition: background-color ease 0.15s;
    width: 7px;
  }

  span:hover::before {
    background-color: var(--accent-color);
  }

  input:checked + span::before {
    background-color: var(--accent-color);
  }
</style>
