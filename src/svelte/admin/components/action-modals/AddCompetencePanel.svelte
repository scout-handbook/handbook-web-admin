<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import DescriptionInput from "../forms/DescriptionInput.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import NumberNameInput from "../forms/NumberNameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let number = "";
  let name = "Nová kompetence";
  let description = "Popis nové kompetence";
  let donePromise: Promise<void> | null = null;
  const { revalidate } = useSWR<SWRMutateFix<Record<string, Competence>>>(
    constructURL("v1.0/competence"),
  );

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action($apiUri + "/v1.0/competence", "POST", {
        number: encodeURIComponent(number),
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
      }),
    ])
      .dispatch()
      .then(() => {
        revalidate({ force: true });
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Kompetence byla úspěšně přidána.</DoneDialog>
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
