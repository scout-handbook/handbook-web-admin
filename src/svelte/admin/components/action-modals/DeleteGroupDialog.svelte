<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let groups: IDList<Group>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  const group = groups.get(payload.groupId)!;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function confirmCallback() {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
        "DELETE"
      ),
    ]).dispatch();
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
