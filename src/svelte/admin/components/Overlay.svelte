<script lang="ts">
  import { customProperties } from "../../../ts/admin/stores";

  $: ({ "--overlay-color": overlayColor } = $customProperties);
</script>

<div style:background-color={overlayColor} />

<style>
  div {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
</style>
