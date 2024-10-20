<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { siteName } from "../../../ts/admin/stores";
  import { get } from "../../../ts/admin/utils/arrayUtils";
  import AddGroupPanel from "../components/action-modals/AddGroupPanel.svelte";
  import DeleteGroupDialog from "../components/action-modals/DeleteGroupDialog.svelte";
  import EditGroupPanel from "../components/action-modals/EditGroupPanel.svelte";
  import ImportGroupMembersPanel from "../components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "../components/Button.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { groupId: string };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: actionPayload = $location.state?.actionPayload;

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
</script>

{#if action === "add-group"}
  <AddGroupPanel />
{:else if action === "change-group"}
  <GroupProvider silent let:groups>
    {@const group = get(groups, actionPayload.groupId)}
    {#if group !== undefined}
      <EditGroupPanel {group} groupId={actionPayload.groupId} />
    {/if}
  </GroupProvider>
{:else if action === "delete-group"}
  <GroupProvider silent let:groups>
    {@const group = get(groups, actionPayload.groupId)}
    {#if group !== undefined}
      <DeleteGroupDialog {group} groupId={actionPayload.groupId} />
    {/if}
  </GroupProvider>
{:else if action === "import-group-members"}
  <GroupProvider silent let:groups>
    {@const group = get(groups, actionPayload.groupId)}
    {#if group !== undefined}
      <ImportGroupMembersPanel {group} groupId={actionPayload.groupId} />
    {/if}
  </GroupProvider>
{/if}

<h1>{`${$siteName} - Uživatelské skupiny`}</h1>
{#if adminOrSuperuser}
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
<GroupProvider let:groups>
  {#each groups as [id, group] (id)}
    {#if id === "00000000-0000-0000-0000-000000000000"}
      <br />
      <h3 class="public">{group.name}</h3>
    {:else}
      <br />
      <h3>{group.name}</h3>
    {/if}
    {#if adminOrSuperuser}
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
      <span>
        {`Uživatelů: ${group.count.toString()}`}
      </span>
    {/if}
  {/each}
</GroupProvider>

<style>
  .public {
    font-style: italic;
  }

  h3 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 1.9em;
  }
</style>
