<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import AddGroupPanel from "$lib/components/action-modals/AddGroupPanel.svelte";
  import DeleteGroupDialog from "$lib/components/action-modals/DeleteGroupDialog.svelte";
  import EditGroupPanel from "$lib/components/action-modals/EditGroupPanel.svelte";
  import ImportGroupMembersPanel from "$lib/components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { groups, sortGroups } from "$lib/resources/groups.svelte";
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
    {@const group = groups.current?.get(pageState.actionPayload.groupId)}
    {#if group !== undefined}
      <EditGroupPanel {group} groupId={pageState.actionPayload.groupId} />
    {/if}
  {:else if pageState.action === "delete-group"}
    {@const group = groups.current?.get(pageState.actionPayload.groupId)}
    {#if group !== undefined}
      <DeleteGroupDialog {group} groupId={pageState.actionPayload.groupId} />
    {/if}
  {:else if pageState.action === "import-group-members"}
    {@const group = groups.current?.get(pageState.actionPayload.groupId)}
    {#if group !== undefined}
      <ImportGroupMembersPanel
        {group}
        groupId={pageState.actionPayload.groupId}
      />
    {/if}
  {/if}

  <h1>{`${CONFIG["site-name"]} - Uživatelské skupiny`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        pushState("", { action: "add-group" });
      }}
    >
      Přidat
    </Button>
  {/if}
  {#if groups.current === undefined}
    <LoadingIndicator />
  {:else}
    {#each sortGroups(groups.current) as [id, group] (id)}
      <br />
      <h3 class:public={id === "00000000-0000-0000-0000-000000000000"}>
        {group.name}
      </h3>
      {#if adminOrSuperuser}
        <Button
          cyan
          icon="pencil"
          onclick={(): void => {
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
            onclick={(): void => {
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
            onclick={(): void => {
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
  {/if}
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
