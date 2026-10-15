<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";

  import type { Group } from "#lib/interfaces/Group.js";

  import { Action } from "#lib/actions/Action.js";
  import { ActionQueue } from "#lib/actions/ActionQueue.js";
  import Dialog from "#lib/components/Dialog.svelte";
  import DoneDialog from "#lib/components/DoneDialog.svelte";
  import { apiUri } from "#lib/config.js";
  import { deepClone } from "#lib/utils/deepClone.js";
  import { queryClient } from "#lib/utils/queryClient.js";

  interface Props {
    group: Group;
    groupId: string;
  }

  let { group, groupId }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation(() => ({
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "group"] });
      const cachedGroups = queryClient.getQueryData<Record<string, Group>>([
        "v1.0",
        "group",
      ]);
      if (cachedGroups !== undefined) {
        const { [groupId]: _, ...newGroups } = deepClone(cachedGroups);
        queryClient.setQueryData<Record<string, Group>>(
          ["v1.0", "group"],
          newGroups,
        );
      }
    },
  }));

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${apiUri}/v1.0/group/${encodeURIComponent(groupId)}`,
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
  <DoneDialog {donePromise}>Skupina byla úspěšně smazána.</DoneDialog>
{:else}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    onconfirm={confirmCallback}
    ondismiss={(): void => {
      history.back();
    }}
  >
    Opravdu si přejete smazat skupinu "{group.name}"?
  </Dialog>
{/if}
