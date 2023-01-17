<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Dialog from "../Dialog.svelte";

  export let competences: IDList<Competence>;
  export let payload: { competenceId: string };

  const navigate = useNavigate();

  const competence = competences.get(payload.competenceId)!;

  refreshLogin();

  function confirmCallback() {
    new ActionQueue([
      new Action(
        $apiUri +
          "/v1.0/competence/" +
          encodeURIComponent(payload.competenceId),
        "DELETE"
      ),
    ]).defaultDispatch();
  }
</script>

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
