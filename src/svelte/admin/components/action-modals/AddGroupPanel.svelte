<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let name = "Nová skupina";
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action($apiUri + "/v1.0/group", "POST", {
        name: encodeURIComponent(name),
      }),
    ]).dispatch();
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
{:else}
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
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Přidat skupinu</h1>
    <form>
      <label for="fieldName">Název:</label>
      <input
        id="group-name"
        class="form-text"
        autocomplete="off"
        type="text"
        bind:value={name}
      />
      <br />
    </form>
  </SidePanel>
{/if}
