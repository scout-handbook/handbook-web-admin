<script lang="ts">
  import { fly } from "svelte/transition";

  import { customProperties } from "../../../ts/admin/stores";

  $: ({ "--border-color": borderColor } = $customProperties);
</script>

<div
  style:border-left={borderColor}
  class="panel"
  transition:fly={{ x: 939, duration: 300 }}
>
  <slot />
</div>

<style>
  .panel {
    background: white;
    bottom: 0;
    overflow-y: auto;
    padding: 30px;
    position: fixed;
    right: 0;
    top: 0;
    width: 939px;
    z-index: 10;
  }
</style>
