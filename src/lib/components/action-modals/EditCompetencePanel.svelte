<script lang="ts" strictEvents>
  import type { Competence } from "$lib/interfaces/Competence";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import DescriptionInput from "$lib/components/forms/DescriptionInput.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import NumberNameInput from "$lib/components/forms/NumberNameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";
  import { createMutation } from "@tanstack/svelte-query";

  export let competence: Competence;
  export let competenceId: string;

  let { description, name, number } = competence;
  let donePromise: Promise<void> | null = null;

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "competence"] });
      const cachedCompetences = queryClient.getQueryData<
        Record<string, Competence>
      >(["v1.0", "competence"]);
      if (cachedCompetences !== undefined) {
        const newCompetences = structuredClone(cachedCompetences);
        newCompetences[competenceId].number = number;
        newCompetences[competenceId].name = name;
        newCompetences[competenceId].description = description;
        queryClient.setQueryData<Record<string, Competence>>(
          ["v1.0", "competence"],
          newCompetences,
        );
      }
    },
  });

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
          $mutation.mutate();
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
