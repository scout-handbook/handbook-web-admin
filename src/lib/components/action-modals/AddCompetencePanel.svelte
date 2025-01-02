<script lang="ts">
  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import DescriptionInput from "$lib/components/forms/DescriptionInput.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import NumberNameInput from "$lib/components/forms/NumberNameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { queryClient } from "$lib/utils/queryClient";

  let number = $state("0");
  let name = $state("Nový bod");
  let description = $state("Popis nového bodu");
  let donePromise: Promise<void> | null = $state(null);

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action(`${CONFIG["api-uri"]}/v1.0/competence`, "POST", {
        description: encodeURIComponent(description),
        name: encodeURIComponent(name),
        number: encodeURIComponent(number),
      }),
    ])
      .dispatch()
      .then(() => {
        void queryClient.invalidateQueries({
          queryKey: ["v1.0", "competence"],
        });
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Bod byl úspěšně přidán.</DoneDialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      onclick={(): void => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
    <h1>Přidat bod</h1>
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
