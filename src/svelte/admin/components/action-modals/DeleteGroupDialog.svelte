<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import Dialog from "../Dialog.svelte";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import { IDList } from "../../../../ts/admin/IDList";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";

  export let groups: IDList<Group>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  const group = groups.get(payload.groupId)!;

  refreshLogin();

  function confirmCallback() {
    new ActionQueue([
      new Action(
        $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
        "DELETE"
      ),
    ]).defaultDispatch(false);
  }
</script>

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
