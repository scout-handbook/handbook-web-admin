<script lang="ts" strictEvents>
  import Dialog from "$lib/components/Dialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import { createEventDispatcher } from "svelte";

  interface $$Slots {
    default: Record<string, never>;
  }

  export let donePromise: Promise<void>;

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
    <slot />
  </Dialog>
{/await}
