<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let payload: { imageId: string };

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Array<string>>>(
    constructURL("v1.0/image"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/image/${encodeURIComponent(payload.imageId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        mutate(
          SWRMutateFnWrapper((images) => {
            images.splice(images.indexOf(payload.imageId), 1);
            return images;
          }),
        );
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Obrázek byl úspěšně smazán.</DoneDialog>
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
