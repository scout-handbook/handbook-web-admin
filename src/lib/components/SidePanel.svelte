<script lang="ts" strictEvents>
  import Overlay from "$lib/components/Overlay.svelte";
  import { fly } from "$lib/transition";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<Overlay />
<!-- eslint-disable-next-line svelte/no-inline-styles -->
<div transition:fly|global={{ duration: 300, from: "right" }}>
  <slot />
</div>

<style>
  div {
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
