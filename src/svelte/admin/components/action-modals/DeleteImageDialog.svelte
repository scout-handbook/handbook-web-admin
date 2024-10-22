<script lang="ts" strictEvents>
  import { createMutation } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { queryClient } from "../../../../ts/admin/utils/queryClient";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let payload: { imageId: string };

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "image"] });
      const cachedImages = queryClient.getQueryData<Array<string>>([
        "v1.0",
        "image",
      ]);
      if (cachedImages !== undefined) {
        const newImages = structuredClone(cachedImages);
        newImages.splice(newImages.indexOf(payload.imageId), 1);
        queryClient.setQueryData<Array<string>>(["v1.0", "image"], newImages);
      }
    },
  });

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/image/${encodeURIComponent(payload.imageId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        $mutation.mutate();
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
