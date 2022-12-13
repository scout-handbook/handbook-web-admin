<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import AddGroupPanel from "../components/action-modals/AddGroupPanel.svelte";
  import Button from "../components/Button.svelte";
  import { changeGroupOnClick } from "../../../ts/admin/actions/changeGroup";
  import { deleteGroupOnClick } from "../../../ts/admin/actions/deleteGroup";
  import { Group } from "../../../ts/admin/interfaces/Group";
  import { IDList } from "../../../ts/admin/IDList";
  import { importGroupOnClick } from "../../../ts/admin/actions/importGroup";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { siteName } from "../../../ts/admin/stores";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state?.action;

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-group"}
  <AddGroupPanel />
{/if}

<h1>{$siteName + " - Uživatelské skupiny"}</h1>
{#if adminPermissions}
  <Button
    green
    icon="plus"
    on:click={() => {
      navigate("/groups", { state: { action: "add-group" } });
    }}
  >
    Přidat
  </Button>
{/if}
{#each groups.asArray() as { id, value: group }}
  {#if id === "00000000-0000-0000-0000-000000000000"}
    <br />
    <h3 class="main-page public-group">{group.name}</h3>
  {:else}
    <br />
    <h3 class="main-page">{group.name}</h3>
  {/if}
  {#if adminPermissions}
    <Button
      cyan
      icon="pencil"
      on:click={() => {
        changeGroupOnClick(id);
      }}
    >
      Upravit
    </Button>
    {#if id !== "00000000-0000-0000-0000-000000000000"}
      <Button
        icon="trash-empty"
        red
        on:click={() => {
          deleteGroupOnClick(id);
        }}
      >
        Smazat
      </Button>
      <Button
        icon="user-plus"
        on:click={() => {
          importGroupOnClick(id);
        }}
      >
        Importovat ze SkautISu
      </Button>
    {/if}
  {/if}
  {#if id !== "00000000-0000-0000-0000-000000000000"}
    <br />
    <span class="main-page">
      {"Uživatelů: " + group.count.toString()}
    </span>
  {/if}
{/each}
