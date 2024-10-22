<script lang="ts" strictEvents>
  import { createMutation } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { queryClient } from "../../../../ts/admin/utils/queryClient";
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
