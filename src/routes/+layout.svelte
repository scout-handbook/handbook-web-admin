<script lang="ts">
  import "$lib/font/fontello.css";
  import "@fontsource/open-sans/400.css";
  import "@fontsource/open-sans/400-italic.css";
  import "@fontsource/open-sans/700.css";
  import "@fontsource/open-sans/700-italic.css";

  import type { Snippet } from "svelte";

  import { base } from "$app/paths";
  import { setupActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import {
    globalDialogMessage,
    globalLoadingIndicator,
    siteName,
  } from "$lib/stores";
  import { checkLogin } from "$lib/utils/checkLogin";
  import { compileMarkdownSetup } from "$lib/utils/compileMarkdown";
  import { loginRefreshSetup } from "$lib/utils/loginRefresh";
  import { queryClient } from "$lib/utils/queryClient";
  import { QueryClientProvider } from "@tanstack/svelte-query";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  checkLogin();
  compileMarkdownSetup();
  loginRefreshSetup();
  setupActionQueue();
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

<QueryClientProvider client={queryClient}>
  {#if $globalLoadingIndicator}
    <Overlay />
    <LoadingIndicator darkBackground />
  {/if}
  {#if $globalDialogMessage !== null}
    <Dialog
      confirmButtonText="OK"
      on:confirm={() => {
        globalDialogMessage.set(null);
      }}
    >
      {$globalDialogMessage}
    </Dialog>
  {/if}
  {@render children()}
</QueryClientProvider>

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
