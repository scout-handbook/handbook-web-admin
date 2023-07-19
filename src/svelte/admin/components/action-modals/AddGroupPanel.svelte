<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let name = "Nová skupina";
  let donePromise: Promise<void> | null = null;
  const { revalidate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action($apiUri + "/v1.0/group", "POST", {
        name: encodeURIComponent(name),
      }),
    ])
      .dispatch()
      .then(() => {
        revalidate({ force: true });
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně přidána.</DoneDialog>
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
    </form>
  </SidePanel>
{/if}
