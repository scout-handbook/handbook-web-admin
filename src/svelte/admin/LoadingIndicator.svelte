<div style:display={$loadingIndicatorVisible ? "block" : "none"} />

<script lang="ts">
  import { loadingIndicatorVisible } from "../../ts/admin/stores";
</script>

<style>
  div {
    animation: spin 2s linear infinite;
    border: 16px solid var(--background-darker);
    border-radius: 50%;
    border-top: 16px solid var(--accent-color);
    height: 120px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    z-index: 9;
  }
</style>
