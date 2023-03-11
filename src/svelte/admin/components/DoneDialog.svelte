<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import Dialog from "./Dialog.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Overlay from "./Overlay.svelte";

  export let donePromise: Promise<void>;

  const navigate = useNavigate();
</script>

{#await donePromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    <!-- TODO: Enable custom messages? -->
    Akce byla úspěšná.
  </Dialog>
{/await}
