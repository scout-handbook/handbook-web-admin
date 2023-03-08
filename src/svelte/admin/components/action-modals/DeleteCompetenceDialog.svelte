<script lang="ts" strictEvents>
  import { mutate } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let competences: Array<[string, Competence]>;
  export let payload: { competenceId: string };

  const navigate = useNavigate();

  const competence = get(competences, payload.competenceId)!;
  let donePromise: Promise<void> | null = null;

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri +
          "/v1.0/competence/" +
          encodeURIComponent(payload.competenceId),
        "DELETE"
      ),
    ]).dispatch();
    // TODO: Also mutate lessons which may contain the deleted competence? Or just revalidate them?
    mutate<SWRMutateFix<Record<string, Competence>>>(
      constructURL("v1.0/competence"),
      SWRMutateFnWrapper((competences) => {
        delete competences[payload.competenceId];
        return competences;
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
    Opravdu si přejete smazat kompetenci {competence.number}: "{competence.name}"?
  </Dialog>
{/if}
