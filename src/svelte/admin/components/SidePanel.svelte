<script lang="ts" strictEvents>
  import { fly } from "svelte/transition";

  import Overlay from "./Overlay.svelte";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<Overlay />
<div class="panel" transition:fly={{ x: 539, duration: 300 }}>
  <slot />
</div>

<style>
  .panel {
    background: white;
    border-left: var(--border-color);
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
