<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import DescriptionInput from "../forms/DescriptionInput.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import NumberNameInput from "../forms/NumberNameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let number = 0;
  let name = "Nová kompetence";
  let description = "Popis nové kompetence";
  let donePromise: Promise<void> | null = null;

  function saveCallback(): void {
    donePromise = new ActionQueue([
      // TODO: SSWR revalidation/mutation
      new Action($apiUri + "/v1.0/competence", "POST", {
        number: encodeURIComponent(number),
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
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
    <h1>Přidat kompetenci</h1>
    <form>
      <span class="competence-heading">Kompetence</span>
      <NumberNameInput bind:value={number} />
      <br />
      <NameInput bind:value={name} />
      <br />
      <DescriptionInput bind:value={description} />
    </form>
  </SidePanel>
{/if}

<style>
  .competence-heading {
    font-size: 1.5em;
    font-weight: bold;
  }
</style>
