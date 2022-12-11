<script lang="ts">
  import { addGroup } from "../../../ts/admin/actions/addGroup";
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
  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

<h1>{$siteName + " - Uživatelské skupiny"}</h1>
{#if adminPermissions}
  <Button green icon="plus" on:click={addGroup}>Přidat</Button>
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
