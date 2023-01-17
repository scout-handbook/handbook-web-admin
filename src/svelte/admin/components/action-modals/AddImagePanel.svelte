<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { refreshMetadata } from "../../../../ts/admin/metadata";
  import { apiUri } from "../../../../ts/admin/stores";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let stage: "select" | "upload" | "done" | "error" = "select";
  let files: FileList;

  function addImageSave(): void {
    if (files.length === 0) {
      return;
    }
    if (!FormData) {
      stage = "error";
      return;
    }
    stage = "upload";
    const formData = new FormData();
    formData.append("image", files[0]);
    request(
      $apiUri + "/v1.0/image",
      "POST",
      formData,
      function (): void {
        stage = "done";
      },
      authFailHandler
    );
  }

  refreshLogin();
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
    <h3 class="side-panel-title">Nahrát obrázek</h3>
    <form id="side-panel-form">
      <div class="form-row">
        <label class="form-file">
          <input class="form-file" type="file" bind:files />
          <Button icon="upload">
            {#if !files || files.length === 0}
              Vybrat soubor
            {:else}
              {files[0].name}
            {/if}
          </Button>
        </label>
      </div>
    </form>
  </SidePanel>
{:else if stage === "upload"}
  <Overlay />
  <LoadingIndicator darkBackground />
{:else if stage === "done"}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      refreshMetadata();
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
