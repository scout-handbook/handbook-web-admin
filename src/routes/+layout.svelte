<script lang="ts" strictEvents>
  import "$lib/font/fontello.css";
  import "@fontsource/open-sans/400.css";
  import "@fontsource/open-sans/400-italic.css";
  import "@fontsource/open-sans/700.css";
  import "@fontsource/open-sans/700-italic.css";
  import { base } from "$app/paths";
  import { siteName } from "$lib/stores";

  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<svelte:head>
  <title>{$siteName}</title>
  <link
    href="{base}/apple-touch-icon.png"
    rel="apple-touch-icon"
    sizes="180x180"
  />
  <link
    href="{base}/favicon-32x32.png"
    rel="icon"
    sizes="32x32"
    type="image/png"
  />
  <link
    href="{base}/favicon-16x16.png"
    rel="icon"
    sizes="16x16"
    type="image/png"
  />
  <link href="{base}/safari-pinned-tab.svg" rel="mask-icon" />
  <link href="{base}/favicon.ico" rel="shortcut icon" />
  <meta name="msapplication-config" content="{base}/browserconfig.xml" />
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
