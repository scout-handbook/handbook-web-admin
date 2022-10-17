<script lang="ts">
  import { customProperties } from "../../../ts/admin/stores";

  $: ({
    "--accent-color": accentColor,
    "--background-darker": backgroundDarker,
    "--overlay-color": overlayColor,
  } = $customProperties);
</script>

<div style:background-color={overlayColor} class="overlay" />
<div
  style:border-color={backgroundDarker}
  style:border-top-color={accentColor}
  class="spinner"
/>

<style>
  .overlay {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .spinner {
    animation: spin 2s linear infinite;
    border-radius: 50%;
    border-style: solid;
    border-width: 16px;
    height: 120px;
    left: 50%;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    z-index: 9;
  }
</style>
