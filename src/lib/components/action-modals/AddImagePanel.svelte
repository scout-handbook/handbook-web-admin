<script lang="ts" strictEvents>
  import Button from "$lib/components/Button.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import FileInput from "$lib/components/forms/FileInput.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";
  import { authFailHandler, request } from "$lib/utils/request";

  let stage: "done" | "error" | "select" | "upload" = "select";
  let files: FileList | undefined;

  function saveCallback(): void {
    if (files === undefined || files.length === 0) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- FormData isn't present in very old browsers
    if (!FormData) {
      stage = "error";
      return;
    }
    stage = "upload";
    const formData = new FormData();
    formData.append("image", files[0]);
    void request(
      `${$apiUri}/v1.0/image`,
      "POST",
      formData,
      authFailHandler,
    ).then(() => {
      void queryClient.invalidateQueries({
        queryKey: ["v1.0", "image"],
      });
      stage = "done";
    });
  }
</script>

{#if stage === "select"}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        history.back();
      }}
    >
      Zrušit
    </Button>
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Nahrát obrázek</h1>
    <form>
      <FileInput bind:files />
    </form>
  </SidePanel>
{:else if stage === "upload"}
  <Overlay />
  <LoadingIndicator darkBackground />
{:else if stage === "done"}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      history.back();
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      history.back();
    }}
  >
    Tento prohlížeč nepodporuje nahrávání souborů.
  </Dialog>
{/if}
