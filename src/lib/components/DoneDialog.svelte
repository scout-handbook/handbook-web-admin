<script lang="ts">
  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import { createEventDispatcher, type Snippet } from "svelte";

  interface Props {
    children: Snippet;
    donePromise: Promise<void>;
  }

  let { children, donePromise }: Props = $props();

  const dispatch = createEventDispatcher<{ confirm: null; dismiss: null }>();
</script>

{#await donePromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      history.back();
      dispatch("confirm");
    }}
  >
    {@render children()}
  </Dialog>
{/await}
