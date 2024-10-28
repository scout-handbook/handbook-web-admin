<script lang="ts" strictEvents>
  type KeyType = $$Generic<number | string>;
  type ValueType = $$Generic;

  export let options: Array<[KeyType, ValueType]>;
  export let selected: Array<KeyType>;

  interface $$Slots {
    default: { id: KeyType; value: ValueType };
  }
</script>

{#each options as [id, value] (id)}
  <label>
    <input type="checkbox" value={id} bind:group={selected} />
    <span />
    <slot {id} {value} />
  </label>
{/each}

<style>
  label {
    display: block;
    margin-top: 30px;
  }

  input {
    display: none;
  }

  span {
    background-color: var(--background-darker);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    height: 15px;
    margin-bottom: -2px;
    margin-right: 10px;
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
    width: 15px;
  }

  span:hover {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }

  span::before {
    border: 3px solid var(--border-color);
    border-right: none;
    border-top: none;
    content: "";
    height: 4px;
    margin-left: 2px;
    margin-top: 3px;
    position: absolute;
    transform: rotate(-45deg);
    transition: border-color ease 0.15s;
    width: 8px;
  }

  span:hover::before {
    border-color: var(--accent-color);
  }

  input:checked + span {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
  }

  input:checked + span::before {
    border-color: var(--accent-color);
  }
</style>
