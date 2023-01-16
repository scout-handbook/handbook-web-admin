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
  import { User } from "../../../../ts/admin/interfaces/User";

  export let groups: IDList<Group>;
  export let payload: { user: User };

  const navigate = useNavigate();

  let done = false;
  let selectedGroups = payload.user.groups;

  $: publicName =
    groups.get("00000000-0000-0000-0000-000000000000")?.name ?? "";

  refreshLogin();

  function saveCallback() {
    if (
      selectedGroups.length === payload.user.groups.length &&
      selectedGroups.every(
        (value, index) => value === payload.user.groups[index]
      )
    ) {
      done = true;
    } else {
      new ActionQueue([
        new Action(
          $apiUri +
            "/v1.0/user/" +
            encodeURIComponent(payload.user.id) +
            "/group",
          "PUT",
          { group: selectedGroups.map(encodeURIComponent) }
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
    <h3 class="side-panel-title">Změnit skupiny: {payload.user.name}</h3>
    <form id="side-panel-form">
      {#each groups.asArray() as { id, value: group }}
        {#if id !== "00000000-0000-0000-0000-000000000000"}
          <div class="form-row">
            <label class="form-switch">
              <input type="checkbox" value={id} bind:group={selectedGroups} />
              <span class="form-custom form-checkbox" />
            </label>
            {group.name}
          </div>
        {/if}
      {/each}
    </form>
    <div class="group-help">
      <i class="icon-info-circled" />
      Každého uživatele lze zařadit do několika skupin (nebo i žádné). Podle toho
      poté tento uživatel bude moct zobrazit pouze lekce, které byly těmto skupiným
      zveřejněny. Lekce ve skupině "<span class="public-group"
        >{publicName}</span
      >" uvidí všichni uživatelé bez ohledu na jejich skupiny.
    </div>
  </SidePanel>
{/if}
