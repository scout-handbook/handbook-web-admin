<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import Dialog from "./Dialog.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Overlay from "./Overlay.svelte";

  export let confirmPromise: Promise<void>;

  const navigate = useNavigate();
</script>

{#await confirmPromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{/await}
