<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import type { Field } from "$lib/interfaces/Field";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";

  export let fields: Array<[string, Field]>;
  export let payload: { fieldId: string };

  const navigate = useNavigate();

  const field = get(fields, payload.fieldId)!;
  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/field/" + encodeURIComponent(payload.fieldId),
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        mutate(
          SWRMutateFnWrapper((cachedFields) => {
            delete cachedFields[payload.fieldId];
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
