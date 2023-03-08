<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<div
  on:click={() => {
    dispatch("click");
  }}
  on:keypress={() => {
    dispatch("click");
  }}
  transition:fade={{ duration: 100 }}
/>

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
