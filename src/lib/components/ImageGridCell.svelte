<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    display: inline-block;
    margin-top: 50px;
    position: relative;
    text-align: center;
    width: 256px;
  }
</style>
