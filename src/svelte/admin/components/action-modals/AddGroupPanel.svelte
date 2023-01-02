<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { Payload } from "../../../../ts/admin/interfaces/Payload";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  refreshLogin();

  function addGroupPayloadBuilder(): Payload {
    // TODO: Svelte-ify
    return {
      name: encodeURIComponent(
        (document.getElementById("group-name") as HTMLInputElement).value
      ),
    };
  }

  function saveCallback(): void {
    new ActionQueue([
      new Action($apiUri + "/v1.0/group", "POST", addGroupPayloadBuilder),
    ]).defaultDispatch(false);
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
  <h3 class="side-panel-title">Přidat skupinu</h3>
  <form id="side-panel-form">
    <legend for="fieldName">Název:</legend>
    <input
      id="group-name"
      class="form-text"
      autocomplete="off"
      type="text"
      value="Nová skupina"
    />
    <br />
  </form>
</SidePanel>
