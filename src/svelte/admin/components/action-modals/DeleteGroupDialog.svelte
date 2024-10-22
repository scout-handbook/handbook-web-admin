<script lang="ts" strictEvents>
  import { createMutation } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import type { Group } from "../../../../ts/admin/interfaces/Group";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { queryClient } from "../../../../ts/admin/utils/queryClient";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let group: Group;
  export let groupId: string;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "group"] });
      const cachedGroups = queryClient.getQueryData<Record<string, Group>>([
        "v1.0",
        "group",
      ]);
      if (cachedGroups !== undefined) {
        const { [groupId]: _, ...newGroups } = structuredClone(cachedGroups);
        queryClient.setQueryData<Record<string, Group>>(
          ["v1.0", "group"],
          newGroups,
        );
      }
    },
  });

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/group/${encodeURIComponent(groupId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        $mutation.mutate();
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně smazána.</DoneDialog>
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
