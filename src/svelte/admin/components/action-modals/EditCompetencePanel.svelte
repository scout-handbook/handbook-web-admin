<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import DescriptionInput from "../forms/DescriptionInput.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import NumberNameInput from "../forms/NumberNameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let competence: Competence;
  export let competenceId: string;

  const navigate = useNavigate();

  let { description, name, number } = competence;
  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Competence>>>(
    constructURL("v1.0/competence"),
  );

  function saveCallback(): void {
    if (
      competence.number === number &&
      competence.name === name &&
      competence.description === description
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          `${$apiUri}/v1.0/competence/${encodeURIComponent(competenceId)}`,
          "PUT",
          { description, name, number },
        ),
      ])
        .dispatch()
        .then(() => {
          mutate(
            SWRMutateFnWrapper((cachedCompetences) => {
              cachedCompetences[competenceId].number = number;
              cachedCompetences[competenceId].name = name;
              cachedCompetences[competenceId].description = description;
              return cachedCompetences;
            }),
          );
        });
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Bod byl úspěšně upraven.</DoneDialog>
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
    <h1>Upravit bod</h1>
    <form>
      <span class="competence-heading">Bod</span>
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
