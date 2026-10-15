<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";

  import type { Field } from "#lib/interfaces/Field.js";

  import { Action } from "#lib/actions/Action.js";
  import { ActionQueue } from "#lib/actions/ActionQueue.js";
  import Dialog from "#lib/components/Dialog.svelte";
  import DoneDialog from "#lib/components/DoneDialog.svelte";
  import { apiUri } from "#lib/config.js";
  import { deepClone } from "#lib/utils/deepClone.js";
  import { queryClient } from "#lib/utils/queryClient.js";

  interface Props {
    field: Field;
    fieldId: string;
  }

  let { field, fieldId }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation(() => ({
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "field"] });
      const cachedFields = queryClient.getQueryData<Record<string, Field>>([
        "v1.0",
        "field",
        { "override-group": true },
      ]);
      if (cachedFields !== undefined) {
        const { [fieldId]: _, ...newFields } = deepClone(cachedFields);
        queryClient.setQueryData<Record<string, Field>>(
          ["v1.0", "field", { "override-group": true }],
          newFields,
        );
      }
    },
  }));

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${apiUri}/v1.0/field/${encodeURIComponent(fieldId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        mutation.mutate();
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Oblast byla úspěšně smazána.</DoneDialog>
{:else}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    onconfirm={confirmCallback}
    ondismiss={(): void => {
      history.back();
    }}
  >
    Opravdu si přejete smazat oblast "{field.name}"?
  </Dialog>
{/if}
