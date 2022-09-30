<script lang="ts">
  import { addGroup } from "../../ts/admin/actions/addGroup";
  import { changeGroupOnClick } from "../../ts/admin/actions/changeGroup";
  import { config } from "../../ts/admin/stores";
  import { deleteGroupOnClick } from "../../ts/admin/actions/deleteGroup";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { Group } from "../../ts/admin/interfaces/Group";
  import { IDList } from "../../ts/admin/IDList";
  import { importGroupOnClick } from "../../ts/admin/actions/importGroup";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;
  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("group-manager")!.className += " active-top-bar-tab";

  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Uživatelské skupiny"}</h1>
{#if adminPermissions}
  <div id="addGroup" class="button green-button" on:click={addGroup}>
    <i class="icon-plus" />
    Přidat
  </div>
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
    <div class="button cyan-button changeGroup" data-id={id} on:click={changeGroupOnClick}>
      <i class="icon-pencil" />
      Upravit
    </div>
    {#if id !== "00000000-0000-0000-0000-000000000000"}
      <div class="button red-button deleteGroup" data-id={id} on:click={deleteGroupOnClick}>
        <i class="icon-trash-empty" />
        Smazat
      </div>
      <div class="button importGroup" data-id={id} on:click={importGroupOnClick}>
        <i class="icon-user-plus" />
        Importovat ze SkautISu
      </div>
    {/if}
  {/if}
  {#if id !== "00000000-0000-0000-0000-000000000000"}
    <br />
    <span class="main-page">
      {"Uživatelů: " + group.count.toString()}
    </span>
  {/if}
{/each}
