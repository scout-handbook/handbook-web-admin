<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  interface $$Slots {
    default: Record<string, never>;
  }

  export let active = false;

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<button
  class:active
  type="button"
  on:click={() => {
    dispatch("click");
  }}
>
  <slot />
</button>

<style>
  button {
    background-color: var(--background-darker);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    margin: 0 8px;
    padding: 3px 5px;
    transition:
      color ease 0.15s,
      border-color ease 0.15s,
      background-color ease 0.15s;
  }

  button:hover,
  .active {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
</style>
