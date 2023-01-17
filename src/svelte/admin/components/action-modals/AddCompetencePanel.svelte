<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let number = "00";
  let name = "Nová kompetence";
  let description = "Popis nové kompetence";

  refreshLogin();

  function saveCallback() {
    new ActionQueue([
      new Action($apiUri + "/v1.0/competence", "POST", () => ({
        number: encodeURIComponent(number),
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
      })),
    ]).defaultDispatch();
  }
</script>

<SidePanel>
  <Button
    icon="cancel"
    yellow
    on:click={() => {
      navigate(-1);
    }}
  >
    Zrušit
  </Button>
  <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
  <h3 class="side-panel-title">Přidat kompetenci</h3>
  <form id="side-panel-form">
    <span class="competence-heading">Kompetence</span>
    <input
      id="competence-number"
      class="form-text form-name"
      autocomplete="off"
      type="text"
      bind:value={number}
    />
    <br />
    <input
      id="competence-name"
      class="form-text"
      autocomplete="off"
      type="text"
      bind:value={name}
    />
    <br />
    <textarea
      id="competence-description"
      class="form-text"
      autocomplete="off"
      rows="5"
      bind:value={description}
    />
  </form>
</SidePanel>
