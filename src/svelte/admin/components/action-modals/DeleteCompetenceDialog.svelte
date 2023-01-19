<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import type { IDList } from "../../../../ts/admin/IDList";
  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let competences: IDList<Competence>;
  export let payload: { competenceId: string };

  const navigate = useNavigate();

  const competence = competences.get(payload.competenceId)!;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function confirmCallback() {
    donePromise = new ActionQueue([
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
