<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import FileInput from "$lib/components/forms/FileInput.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { queryClient } from "$lib/utils/queryClient";
  import { authFailHandler, request } from "$lib/utils/request";

  let stage: "done" | "error" | "select" | "upload" = $state("select");
  let files: FileList | undefined = $state();

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
      `${CONFIG["api-uri"]}/v1.0/image`,
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
      onclick={(): void => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
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
    onconfirm={(): void => {
      history.back();
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else}
  <Dialog
    confirmButtonText="OK"
    onconfirm={(): void => {
      history.back();
    }}
  >
    Tento prohlížeč nepodporuje nahrávání souborů.
  </Dialog>
{/if}
