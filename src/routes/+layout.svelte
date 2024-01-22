<script lang="ts" strictEvents>
  import { siteName } from "$lib/stores";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<svelte:head>
  <title>{$siteName}</title>
</svelte:head>

<slot />

<style>
  :global(body) {
    color: var(--background);
    font-family: "Open Sans", sans-serif;
    font-feature-settings: "liga" 1; /* stylelint-disable-line plugin/no-unsupported-browser-features */
    font-kerning: normal; /* stylelint-disable-line plugin/no-unsupported-browser-features */
    font-size: 16px;
    height: 100%;
    line-height: 160%;
    margin: 0;
    position: absolute;
    width: 100%;
  }

  :global(h1) {
    line-height: 140%;
  }
</style>
