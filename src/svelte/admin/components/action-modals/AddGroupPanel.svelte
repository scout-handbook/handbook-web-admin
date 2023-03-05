<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let name = "Nová skupina";
  let donePromise: Promise<void> | null = null;

  function saveCallback(): void {
    donePromise = new ActionQueue([
      // TODO: SSWR revalidation/mutation
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
      <NameInput bind:value={name} />
      <br />
    </form>
  </SidePanel>
{/if}
