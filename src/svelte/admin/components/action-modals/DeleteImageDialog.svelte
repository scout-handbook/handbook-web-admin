<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import ConfirmationDialog from "../ConfirmationDialog.svelte";
  import Dialog from "../Dialog.svelte";

  export let payload: { imageId: string };

  const navigate = useNavigate();

  let confirmPromise: Promise<void> | null = null;

  refreshLogin();

  function confirmCallback() {
    confirmPromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/image/" + encodeURIComponent(payload.imageId),
        "DELETE"
      ),
    ]).dispatch();
  }
</script>

{#if confirmPromise !== null}
  <ConfirmationDialog {confirmPromise} />
{:else}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    on:confirm={confirmCallback}
    on:dismiss={() => {
      navigate(-1);
    }}
  >
    Opravdu si přejete smazat tento obrázek?
  </Dialog>
{/if}
