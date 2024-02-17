<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { constructURL } from "$lib/utils/constructURL";

  export let payload: { imageId: string };

  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Array<string>>>(
    constructURL("v1.0/image"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/image/" + encodeURIComponent(payload.imageId),
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        void mutate(
          SWRMutateFnWrapper<Array<string>>((images) => {
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
      history.back();
    }}
  >
    Opravdu si přejete smazat tento obrázek?
  </Dialog>
{/if}
