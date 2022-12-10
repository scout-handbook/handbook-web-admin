<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Payload } from "../../../../ts/admin/interfaces/Payload";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  refreshLogin();

  function saveCallback() {
    new ActionQueue([
      new Action(
        $apiUri + "/v1.0/competence",
        "POST",
        addCompetencePayloadBuilder
      ),
    ]).defaultDispatch();
    navigate(-1);
  }

  function addCompetencePayloadBuilder(): Payload {
    // TODO: Bind values
    return {
      number: encodeURIComponent(
        (document.getElementById("competence-number") as HTMLInputElement).value
      ),
      name: encodeURIComponent(
        (document.getElementById("competence-name") as HTMLInputElement).value
      ),
      description: encodeURIComponent(
        (document.getElementById("competence-description") as HTMLInputElement)
          .value
      ),
    };
  }
</script>

<SidePanel>
  <div
    id="side-panel-cancel"
    class="button yellow-button"
    on:click={() => {
      navigate(-1);
    }}
  >
    <i class="icon-cancel" />
    Zrušit
  </div>
  <div
    id="addCompetenceSave"
    class="button green-button"
    on:click={saveCallback}
  >
    <i class="icon-floppy" />
    Uložit
  </div>
  <h3 class="side-panel-title">Přidat kompetenci</h3>
  <form id="side-panel-form">
    <span class="competence-heading">Kompetence</span>
    <input
      id="competence-number"
      class="form-text form-name"
      autocomplete="off"
      type="text"
      value="00"
    />
    <br />
    <input
      id="competence-name"
      class="form-text"
      autocomplete="off"
      type="text"
      value="Nová kompetence"
    />
    <br />
    <textarea
      id="competence-description"
      class="form-text"
      autocomplete="off"
      rows="5">Popis nové kompetence</textarea
    >
  </form>
</SidePanel>
