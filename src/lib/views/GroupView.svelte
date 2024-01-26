<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import AddGroupPanel from "$lib/components/action-modals/AddGroupPanel.svelte";
  import DeleteGroupDialog from "$lib/components/action-modals/DeleteGroupDialog.svelte";
  import EditGroupPanel from "$lib/components/action-modals/EditGroupPanel.svelte";
  import ImportGroupMembersPanel from "$lib/components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import { siteName } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";

  import type { PageStateFix } from "../../app";

  $: state = $page.state as PageStateFix;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

{#if state.action === "add-group"}
  <AddGroupPanel />
{:else if state.action === "change-group"}
  <GroupProvider silent let:groups>
    <EditGroupPanel {groups} payload={state.actionPayload} />
  </GroupProvider>
{:else if state.action === "delete-group"}
  <GroupProvider silent let:groups>
    <DeleteGroupDialog {groups} payload={state.actionPayload} />
  </GroupProvider>
{:else if state.action === "import-group-members"}
  <GroupProvider silent let:groups>
    <ImportGroupMembersPanel {groups} payload={state.actionPayload} />
  </GroupProvider>
{/if}

<h1>{$siteName + " - Uživatelské skupiny"}</h1>
{#if adminOrSuperuser}
  <Button
    green
    icon="plus"
    on:click={() => {
      void goto(base + "/groups", { state: { action: "add-group" } });
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
          void goto(base + "/groups", {
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
            void goto(base + "/groups", {
              state: { action: "delete-group", actionPayload: { groupId: id } },
            });
          }}
        >
          Smazat
        </Button>
        <Button
          icon="user-plus"
          on:click={() => {
            void goto(base + "/groups", {
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
        <!-- eslint-disable-next-line @typescript-eslint/restrict-plus-operands @typescript-eslint/no-unsafe-call -->
        {"Uživatelů: " + group.count.toString()}
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
