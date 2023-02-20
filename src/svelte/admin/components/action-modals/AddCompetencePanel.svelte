<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import NameInput from "../NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let number = "00";
  let name = "Nová kompetence";
  let description = "Popis nové kompetence";
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function saveCallback(): void {
    donePromise = new ActionQueue([
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
      <input
        id="competence-number"
        class="form-text form-name"
        autocomplete="off"
        type="text"
        bind:value={number}
      />
      <br />
      <NameInput bind:value={name} />
      <br />
      <textarea
        class="form-text space-above"
        autocomplete="off"
        rows="5"
        bind:value={description}
      />
    </form>
  </SidePanel>
{/if}

<style>
  .space-above {
    margin-top: 20px;
  }
</style>
