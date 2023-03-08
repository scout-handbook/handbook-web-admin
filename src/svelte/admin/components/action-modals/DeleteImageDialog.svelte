<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let payload: { imageId: string };

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/image/" + encodeURIComponent(payload.imageId),
        "DELETE"
      ),
    ]).dispatch();
    mutate<SWRMutateFix<Array<string>>>(
      constructURL("v1.0/image"),
      SWRMutateFnWrapper((images) => {
        images.splice(images.indexOf(payload.imageId), 1);
        return images;
      })
    );
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
