<script lang="ts" strictEvents>
  import { fly } from "../../../ts/admin/transition";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<!-- eslint-disable-next-line svelte/no-inline-styles -->
<div transition:fly={{ duration: 300, from: "right" }}>
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
    width: 939px;
    z-index: 11;
  }
</style>
