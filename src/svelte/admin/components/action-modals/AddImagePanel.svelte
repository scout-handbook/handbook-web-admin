<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import FileInput from "../forms/FileInput.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let stage: "done" | "error" | "select" | "upload" = "select";
  let files: FileList | undefined;

  function addImageSave(): void {
    if (files === undefined || files.length === 0) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (!FormData) {
      stage = "error";
      return;
    }
    stage = "upload";
    const formData = new FormData();
    formData.append("image", files[0]);
    // TODO: MUTATE?
    void request(
      $apiUri + "/v1.0/image",
      "POST",
      formData,
      authFailHandler
    ).then(() => {
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
        navigate(-1);
      }}
    >
      Zrušit
    </Button>
    <Button green icon="floppy" on:click={addImageSave}>Uložit</Button>
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
      navigate(-1);
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Tento prohlížeč nepodporuje nahrávání souborů.
  </Dialog>
{/if}
