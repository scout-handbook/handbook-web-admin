<script lang="ts">
  import type { Snippet } from "svelte";

  import { fly } from "svelte/transition";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div transition:fly|global={{ duration: 300, x: 939 }}>
  {@render children()}
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
