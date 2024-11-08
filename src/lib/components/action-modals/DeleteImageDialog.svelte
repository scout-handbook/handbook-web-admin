<script lang="ts">
  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    payload: { imageId: string };
  }

  let { payload }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);

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
    onconfirm={confirmCallback}
    ondismiss={() => {
      history.back();
    }}
  >
    Opravdu si přejete smazat tento obrázek?
  </Dialog>
{/if}
