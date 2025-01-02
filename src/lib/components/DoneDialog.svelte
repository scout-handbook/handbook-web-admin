<script lang="ts">
  import type { Snippet } from "svelte";

  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";

  interface Props {
    children: Snippet;
    donePromise: Promise<void>;
    onconfirm?(this: void): void;
  }

  let { children, donePromise, onconfirm }: Props = $props();
</script>

{#await donePromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then}
  <Dialog
    confirmButtonText="OK"
    onconfirm={(): void => {
      history.back();
      onconfirm?.();
    }}
  >
    {@render children()}
  </Dialog>
{/await}
