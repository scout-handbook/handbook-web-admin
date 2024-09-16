<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Field } from "../../../../ts/admin/interfaces/Field";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let field: Field;
  export let fieldId: string;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/field/${encodeURIComponent(fieldId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        mutate(
          SWRMutateFnWrapper((cachedFields) => {
            delete cachedFields[fieldId];
            return cachedFields;
          }),
        );
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Oblast byla úspěšně smazána.</DoneDialog>
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
