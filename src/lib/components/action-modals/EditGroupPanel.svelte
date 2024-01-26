<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import type { Group } from "$lib/interfaces/Group";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const group = get(groups, payload.groupId)!;
  let { name } = group;
  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  function saveCallback(): void {
    if (group.name === name) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
          "PUT",
          { name },
        ),
      ])
        .dispatch()
        .then(() => {
          void mutate(
            SWRMutateFnWrapper<Record<string, Group>>((cachedGroups) => {
              cachedGroups[payload.groupId].name = name;
              return cachedGroups;
            }),
          );
        });
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně upravena.</DoneDialog>
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
    <h1>Upravit skupinu</h1>
    <form>
      <NameInput bind:value={name} />
    </form>
  </SidePanel>
{/if}
