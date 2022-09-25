<div style:border-color={$config["custom-properties"]["--border-color"]} style:border-top-color={$config["custom-properties"]["--accent-color"]} style:display={$loadingIndicatorVisible ? "block" : "none"} />

<script lang="ts">
  import { config, loadingIndicatorVisible } from "../../ts/admin/stores";
  console.log($config["custom-properties"]["--background-darker"]);
  console.log($config["custom-properties"]);
</script>

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
