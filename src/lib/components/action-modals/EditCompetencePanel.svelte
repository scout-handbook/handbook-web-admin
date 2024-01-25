<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import DescriptionInput from "$lib/components/forms/DescriptionInput.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import NumberNameInput from "$lib/components/forms/NumberNameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import type { Competence } from "$lib/interfaces/Competence";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";

  export let competences: Array<[string, Competence]>;
  export let payload: { competenceId: string };

  const competence = get(competences, payload.competenceId)!;
  let { number, name, description } = competence;
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
          $apiUri +
            "/v1.0/competence/" +
            encodeURIComponent(payload.competenceId),
          "PUT",
          { number, name, description },
        ),
      ])
        .dispatch()
        .then(() => {
          void mutate(
            SWRMutateFnWrapper<Record<string, Competence>>((cachedCompetences) => {
              cachedCompetences[payload.competenceId].number = number;
              cachedCompetences[payload.competenceId].name = name;
              cachedCompetences[payload.competenceId].description = description;
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
        history.back();
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
