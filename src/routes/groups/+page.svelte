<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import AddGroupPanel from "$lib/components/action-modals/AddGroupPanel.svelte";
  import DeleteGroupDialog from "$lib/components/action-modals/DeleteGroupDialog.svelte";
  import EditGroupPanel from "$lib/components/action-modals/EditGroupPanel.svelte";
  import ImportGroupMembersPanel from "$lib/components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { siteName } from "$lib/stores";
  import { get } from "$lib/utils/arrayUtils";
  import { createQuery } from "@tanstack/svelte-query";

  import type { PageStateFix } from "../../app";

  let pageState = $derived($page.state as PageStateFix);

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
</script>

<TopBar />
<MainPageContainer>
  {#if pageState.action === "add-group"}
    <AddGroupPanel />
  {:else if pageState.action === "change-group"}
    <GroupProvider silent>
      {#snippet children(groups)}
        {@const group = get(groups, pageState.actionPayload.groupId)}
        {#if group !== undefined}
          <EditGroupPanel {group} groupId={pageState.actionPayload.groupId} />
        {/if}
      {/snippet}
    </GroupProvider>
  {:else if pageState.action === "delete-group"}
    <GroupProvider silent>
      {#snippet children(groups)}
        {@const group = get(groups, pageState.actionPayload.groupId)}
        {#if group !== undefined}
          <DeleteGroupDialog
            {group}
            groupId={pageState.actionPayload.groupId}
          />
        {/if}
      {/snippet}
    </GroupProvider>
  {:else if pageState.action === "import-group-members"}
    <GroupProvider silent>
      {#snippet children(groups)}
        {@const group = get(groups, pageState.actionPayload.groupId)}
        {#if group !== undefined}
          <ImportGroupMembersPanel
            {group}
            groupId={pageState.actionPayload.groupId}
          />
        {/if}
      {/snippet}
    </GroupProvider>
  {/if}

  <h1>{`${$siteName} - Uživatelské skupiny`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={() => {
        pushState("", { action: "add-group" });
      }}
    >
      Přidat
    </Button>
  {/if}
  <GroupProvider>
    {#snippet children(groups)}
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
            onclick={() => {
              pushState("", {
                action: "change-group",
                actionPayload: { groupId: id },
              });
            }}
          >
            Upravit
          </Button>
          {#if id !== "00000000-0000-0000-0000-000000000000"}
            <Button
              icon="trash-empty"
              onclick={() => {
                pushState("", {
                  action: "delete-group",
                  actionPayload: { groupId: id },
                });
              }}
              red
            >
              Smazat
            </Button>
            <Button
              icon="user-plus"
              onclick={() => {
                pushState("", {
                  action: "import-group-members",
                  actionPayload: { groupId: id },
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
    {/snippet}
  </GroupProvider>
</MainPageContainer>

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
