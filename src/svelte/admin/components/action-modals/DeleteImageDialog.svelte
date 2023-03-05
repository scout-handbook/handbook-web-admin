<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let payload: { imageId: string };

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      // TODO: SSWR revalidation/mutation
      new Action(
        $apiUri + "/v1.0/image/" + encodeURIComponent(payload.imageId),
        "DELETE"
      ),
    ]).dispatch();
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
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
