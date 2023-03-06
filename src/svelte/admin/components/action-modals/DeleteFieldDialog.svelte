<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { SWRMutateFix } from "../../../../ts/admin/interfaces/SWRMutateFix";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let fields: Array<[string, Field]>;
  export let payload: { fieldId: string };

  const navigate = useNavigate();

  const field = get(fields, payload.fieldId)!;
  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/field/" + encodeURIComponent(payload.fieldId),
        "DELETE"
      ),
    ]).dispatch();
    mutate<SWRMutateFix<Record<string, Field>>>(
      constructURL("v1.0/field?override-group=true"),
      (fields) => {
        delete fields[payload.fieldId];
        return fields;
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
    Opravdu si přejete smazat oblast "{field.name}"?
  </Dialog>
{/if}
