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
  <!-- TODO: Remove div? -->
  <div>
    <label>
      <input {name} type="radio" value={null} bind:group={selected} />
      <span />
      <slot name="nullOption" />
    </label>
  </div>
{/if}
{#each options as [id, value]}
  <!-- TODO: Remove div? -->
  <div>
    <label>
      <input {name} type="radio" value={id} bind:group={selected} />
      <span />
      <slot {id} name="option" {value} />
    </label>
  </div>
{/each}

<style>
  div {
    margin-top: 30px;
  }

  input {
    display: none;
  }

  span {
    background-color: var(--background-darker);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    display: inline-block;
    height: 15px;
    margin-bottom: -2px;
    margin-right: 10px;
    transition: border-color ease 0.15s, background-color ease 0.15s;
    width: 15px;
  }

  span:hover {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }

  span::before {
    background-color: var(--border-color);
    border-radius: 4px;
    content: "";
    height: 7px;
    margin-left: 4px;
    margin-top: 4px;
    position: absolute;
    transition: background-color ease 0.15s;
    width: 7px;
  }

  span:hover::before {
    background-color: var(--accent-color);
  }

  input:checked + span {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }

  input:checked + span::before {
    background-color: var(--accent-color);
  }
</style>
