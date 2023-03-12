<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { get } from "../../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  const group = get(groups, payload.groupId)!;
  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
        "DELETE"
      ),
    ]).dispatch();
    mutate<SWRMutateFix<Record<string, Group>>>(
      constructURL("v1.0/group"),
      SWRMutateFnWrapper((groups) => {
        delete groups[payload.groupId];
        return groups;
      })
    );
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně smazána.</DoneDialog>
{:else}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    on:confirm={confirmCallback}
    on:dismiss={() => {
      navigate(-1);
    }}
  >
    Opravdu si přejete smazat skupinu "{group.name}"?
  </Dialog>
{/if}
