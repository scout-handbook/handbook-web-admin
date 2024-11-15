<script generics="KeyType extends number | string, ValueType" lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    nullOption?: Snippet;
    option: Snippet<[KeyType, ValueType]>;
    options: Array<[KeyType, ValueType]>;
    selected: KeyType | null;
  }

  let { nullOption, option, options, selected = $bindable() }: Props = $props();

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Workaround for sveltejs/language-tools#2268
  selected;

  const name = Math.random().toString();
</script>

{#if nullOption !== undefined}
  <label>
    <input {name} type="radio" value={null} bind:group={selected} />
    <span></span>
    {@render nullOption()}
  </label>
{/if}
{#each options as [id, value] (id)}
  <label>
    <input {name} type="radio" value={id} bind:group={selected} />
    <span></span>
    {@render option(id, value)}
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
    border-radius: 8px;
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
