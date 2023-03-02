<script lang="ts" strictEvents>
  import { fade, fly } from "svelte/transition";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<!-- TODO: Use Overlay component? It would need to spport transitions -->
<div class="overlay" transition:fade={{ duration: 300 }} />
<div class="panel" transition:fly={{ x: 539, duration: 300 }}>
  <slot />
</div>

<style>
  .overlay {
    background-color: var(--overlay-color);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }

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
