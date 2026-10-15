<script lang="ts">
  import { Action } from "#lib/actions/Action.js";
  import { ActionQueue } from "#lib/actions/ActionQueue.js";
  import Button from "#lib/components/Button.svelte";
  import DoneDialog from "#lib/components/DoneDialog.svelte";
  import NameInput from "#lib/components/forms/NameInput.svelte";
  import SidePanel from "#lib/components/SidePanel.svelte";
  import { apiUri } from "#lib/config.js";
  import { queryClient } from "#lib/utils/queryClient.js";

  let name = $state("Nová skupina");
  let donePromise: Promise<void> | null = $state(null);

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action(`${apiUri}/v1.0/group`, "POST", {
        name: encodeURIComponent(name),
      }),
    ])
      .dispatch()
      .then(() => {
        void queryClient.invalidateQueries({
          queryKey: ["v1.0", "group"],
        });
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně přidána.</DoneDialog>
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
    <h1>Přidat skupinu</h1>
    <form>
      <NameInput bind:value={name} />
    </form>
  </SidePanel>
{/if}
