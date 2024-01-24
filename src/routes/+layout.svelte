<script lang="ts" strictEvents>
  import "$lib/font/fontello.css";
  import "@fontsource/open-sans/400.css";
  import "@fontsource/open-sans/400-italic.css";
  import "@fontsource/open-sans/700.css";
  import "@fontsource/open-sans/700-italic.css";

  import { setupActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import {
    globalDialogMessage,
    globalLoadingIndicator,
    siteName,
  } from "$lib/stores";
  import { setupSWR } from "$lib/swr";
  import { checkLogin } from "$lib/utils/checkLogin";
  import { compileMarkdownSetup } from "$lib/utils/compileMarkdown";
  import { loginRefreshSetup } from "$lib/utils/loginRefresh";

  interface $$Slots {
    default: Record<string, never>;
  }

  checkLogin();
  setupSWR();
  compileMarkdownSetup();
  loginRefreshSetup();
  setupActionQueue();
</script>

<svelte:head>
  <title>{$siteName}</title>
</svelte:head>

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
