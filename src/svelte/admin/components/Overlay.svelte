<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { fade } from "../../../ts/admin/transition";

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<!-- eslint-disable svelte/no-inline-styles -->
<button
  type="button"
  on:click={() => {
    dispatch("click");
  }}
  transition:fade={{ duration: 100 }}
/>

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
