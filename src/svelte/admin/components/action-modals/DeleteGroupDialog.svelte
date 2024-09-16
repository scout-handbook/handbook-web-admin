<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Group } from "../../../../ts/admin/interfaces/Group";

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

  export let group: Group;
  export let groupId: string;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/group/${encodeURIComponent(groupId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        mutate(
          SWRMutateFnWrapper((cachedGroups) => {
            delete cachedGroups[groupId];
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
      navigate(-1);
    }}
  >
    Opravdu si přejete smazat skupinu "{group.name}"?
  </Dialog>
{/if}
