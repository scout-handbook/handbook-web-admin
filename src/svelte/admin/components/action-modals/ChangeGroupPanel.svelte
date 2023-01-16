<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import { IDList } from "../../../../ts/admin/IDList";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";

  export let groups: IDList<Group>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  let done = false;
  const group = groups.get(payload.groupId)!;
  let { name } = group;

  refreshLogin();

  function saveCallback() {
    if (group.name === name) {
      done = true;
    } else {
      new ActionQueue([
        new Action(
          $apiUri + "/v1.0/group/" + encodeURIComponent(payload.groupId),
          "PUT",
          { name }
        ),
      ]).defaultDispatch();
    }
  }
</script>

{#if done}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else}
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
    <h3 class="side-panel-title">Upravit skupinu</h3>
    <form id="side-panel-form">
      <label for="fieldName">Název:</label>
      <input
        id="group-name"
        class="form-text"
        autocomplete="off"
        type="text"
        bind:value={name}
      />
      <br />
    </form>
  </SidePanel>
{/if}
