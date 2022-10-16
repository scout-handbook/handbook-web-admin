<script lang="ts">
  import {
    customProperties,
    loadingIndicatorVisible,
  } from "../../../ts/admin/stores";

  $: ({ "--accent-color": accentColor, "--border-color": borderColor } =
    $customProperties);
</script>

<div
  style:border-color={borderColor}
  style:border-top-color={accentColor}
  style:display={$loadingIndicatorVisible ? "block" : "none"}
/>

<style>
  div {
    animation: spin 2s linear infinite;
    border-radius: 50%;
    border-style: solid;
    border-width: 16px;
    height: 120px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    z-index: 9;
  }
</style>
