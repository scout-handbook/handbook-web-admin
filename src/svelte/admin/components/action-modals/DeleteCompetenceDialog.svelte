<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let competences: Array<[string, Competence]>;
  export let payload: { competenceId: string };

  const navigate = useNavigate();

  const competence = get(competences, payload.competenceId)!;
  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      // TODO: SSWR revalidation/mutation
      new Action(
        $apiUri +
          "/v1.0/competence/" +
          encodeURIComponent(payload.competenceId),
        "DELETE"
      ),
    ]).dispatch();
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
    Opravdu si přejete smazat kompetenci {competence.number}: "{competence.name}"?
  </Dialog>
{/if}
