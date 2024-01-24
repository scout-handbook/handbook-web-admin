<script lang="ts" strictEvents>
  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import {
    globalDialogMessage,
    globalLoadingIndicator,
    siteName,
  } from "$lib/stores";
  import { SWRSetup } from "$lib/swr";

  SWRSetup();
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
