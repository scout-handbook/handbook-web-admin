<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import type { SWRMutateFix } from "../../../../ts/admin/interfaces/SWRMutateFix";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
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
      (groups) => {
        delete groups[payload.groupId];
        return groups;
      }
    );
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
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
