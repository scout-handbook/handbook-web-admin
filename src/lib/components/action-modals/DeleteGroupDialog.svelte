<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import type { Group } from "$lib/interfaces/Group";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const group = get(groups, payload.groupId)!;
  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        void mutate(
          SWRMutateFnWrapper<Record<string, Group>>((cachedGroups) => {
            delete cachedGroups[payload.groupId];
            return cachedGroups;
          }),
        );
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
      history.back();
    }}
  >
    Opravdu si přejete smazat skupinu "{group.name}"?
  </Dialog>
{/if}
