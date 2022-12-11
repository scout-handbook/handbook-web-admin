<script lang="ts">
  import { customProperties } from "../../../ts/admin/stores";
  import Overlay from "./Overlay.svelte";

  $: ({
    "--accent-color": accentColor,
    "--background-darker": backgroundDarker,
  } = $customProperties);
</script>

<Overlay />
<div
  style:border-color={backgroundDarker}
  style:border-top-color={accentColor}
  class="spinner"
/>

<style>
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
