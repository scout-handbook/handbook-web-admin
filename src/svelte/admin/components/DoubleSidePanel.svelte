<script lang="ts" strictEvents>
  import { fly } from "svelte/transition";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<div class="panel" transition:fly={{ x: 939, duration: 300 }}>
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
    width: 939px;
    z-index: 11;
  }
</style>
