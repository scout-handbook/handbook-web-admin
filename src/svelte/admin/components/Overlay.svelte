<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { customProperties } from "../../../ts/admin/stores";

  const dispatch = createEventDispatcher<{ click: never }>();

  $: ({ "--overlay-color": overlayColor } = $customProperties);
</script>

<div
  style:background-color={overlayColor}
  on:click={() => {
    dispatch("click");
  }}
  on:keypress={() => {
    dispatch("click");
  }}
/>

<style>
  div {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
</style>
