<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";
  import { useNavigate } from "svelte-navigator";

  import Dialog from "./Dialog.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Overlay from "./Overlay.svelte";

  interface $$Slots {
    default: Record<string, never>;
  }

  export let donePromise: Promise<void>;

  const navigate = useNavigate();
  const dispatch = createEventDispatcher<{ confirm: null; dismiss: null }>();
</script>

{#await donePromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
      dispatch("confirm");
    }}
  >
    <slot />
  </Dialog>
{/await}
