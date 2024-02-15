<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { get } from "../../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

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
          mutate(
            SWRMutateFnWrapper((cachedGroups) => {
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
        navigate(-1);
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
