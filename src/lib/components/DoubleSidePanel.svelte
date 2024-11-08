<script lang="ts">
  import type { Snippet } from "svelte";

  import { fly } from "$lib/utils/transition";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-inline-styles -->
<div transition:fly|global={{ duration: 300, from: "right" }}>
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
