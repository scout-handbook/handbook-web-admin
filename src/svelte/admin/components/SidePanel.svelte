<script lang="ts" strictEvents>
  import { fade, fly } from "svelte/transition";

  import { customProperties } from "../../../ts/admin/stores";

  interface $$Slots {
    default: Record<string, never>;
  }

  $: ({ "--border-color": borderColor, "--overlay-color": overlayColor } =
    $customProperties);
</script>

<div
  style:background-color={overlayColor}
  class="overlay"
  transition:fade={{ duration: 300 }}
/>
<div
  style:border-left={borderColor}
  class="panel"
  transition:fly={{ x: 539, duration: 300 }}
>
  <slot />
</div>

<style>
  .overlay {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }

  .panel {
    background: white;
    bottom: 0;
    overflow-y: auto;
    padding: 30px;
    position: fixed;
    right: 0;
    top: 0;
    width: 539px;
    z-index: 10;
  }
</style>
