<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { fade } from "../../../ts/admin/transition";

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<!-- eslint-disable svelte/no-inline-styles -->
<div
  on:click={() => {
    dispatch("click");
  }}
  on:keypress={() => {
    dispatch("click");
  }}
  transition:fade={{ duration: 100 }}
/>

<!-- eslint-enable -->

<style>
  div {
    background-color: var(--overlay-color);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
</style>
