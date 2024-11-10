<script lang="ts">
  import { fade } from "svelte/transition";

  interface Props {
    onclick?(this: void): void;
  }

  let { onclick }: Props = $props();
</script>

<button
  aria-label="Body overlay"
  {onclick}
  type="button"
  transition:fade|global={{ duration: 100 }}
></button>

<style>
  button {
    background-color: var(--overlay-color);
    border: none;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
</style>
