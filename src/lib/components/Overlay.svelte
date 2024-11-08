<script lang="ts">
  import { fade } from "$lib/utils/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ click: null }>();
</script>

<!-- eslint-disable svelte/no-inline-styles -->
<button
  aria-label="Body overlay"
  onclick={() => {
    dispatch("click");
  }}
  type="button"
  transition:fade|global={{ duration: 100 }}
></button>

<!-- eslint-enable -->

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
