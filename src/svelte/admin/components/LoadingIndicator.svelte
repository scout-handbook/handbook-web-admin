<script lang="ts" strictEvents>
  import { customProperties } from "../../../ts/admin/stores";

  $: ({
    "--accent-color": accentColor,
    "--background-darker": backgroundDarker,
    "--border-color": borderColor,
  } = $customProperties);

  export let darkBackground = false;

  $: indicatorColor = darkBackground ? backgroundDarker : borderColor;
</script>

<div style:border-color={indicatorColor} style:border-top-color={accentColor} />

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
