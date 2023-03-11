<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { get } from "../../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
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
      SWRMutateFnWrapper((fields) => {
        delete fields[payload.fieldId];
        return fields;
      })
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
