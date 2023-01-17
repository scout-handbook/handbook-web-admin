<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { Field } from "../../../../ts/admin/interfaces/Field";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Dialog from "../Dialog.svelte";

  export let fields: IDList<Field>;
  export let payload: { fieldId: string };

  const field = fields.get(payload.fieldId)!;
  const navigate = useNavigate();

  refreshLogin();

  function confirmCallback() {
    new ActionQueue([
      new Action(
        $apiUri + "/v1.0/field/" + encodeURIComponent(payload.fieldId),
        "DELETE"
      ),
    ]).defaultDispatch();
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
  Opravdu si přejete smazat oblast "{field.name}"?
</Dialog>
