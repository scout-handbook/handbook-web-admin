<script lang="ts">
  import type { Snippet } from "svelte";

  import Overlay from "$lib/components/Overlay.svelte";
  import { fly } from "svelte/transition";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Overlay />
<div transition:fly|global={{ duration: 300, x: 539 }}>
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
    width: 539px;
    z-index: 10;
  }
</style>
