<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { IDList } from "../../../ts/admin/IDList";
  import type { Group } from "../../../ts/admin/interfaces/Group";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { siteName } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import AddGroupPanel from "../components/action-modals/AddGroupPanel.svelte";
  import ChangeGroupPanel from "../components/action-modals/ChangeGroupPanel.svelte";
  import DeleteGroupDialog from "../components/action-modals/DeleteGroupDialog.svelte";
  import ImportGroupMembersPanel from "../components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "../components/Button.svelte";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state.action as string | null;
  $: actionPayload = $location.state.actionPayload as { groupId: string };

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-group"}
  <AddGroupPanel />
{:else if action === "change-group"}
  <ChangeGroupPanel {groups} payload={actionPayload} />
{:else if action === "delete-group"}
  <DeleteGroupDialog {groups} payload={actionPayload} />
{:else if action === "import-group-members"}
  <ImportGroupMembersPanel {groups} payload={actionPayload} />
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
        navigate("/groups", {
          state: { action: "change-group", actionPayload: { groupId: id } },
        });
      }}
    >
      Upravit
    </Button>
    {#if id !== "00000000-0000-0000-0000-000000000000"}
      <Button
        icon="trash-empty"
        red
        on:click={() => {
          navigate("/groups", {
            state: { action: "delete-group", actionPayload: { groupId: id } },
          });
        }}
      >
        Smazat
      </Button>
      <Button
        icon="user-plus"
        on:click={() => {
          navigate("/groups", {
            state: {
              action: "import-group-members",
              actionPayload: { groupId: id },
            },
          });
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
