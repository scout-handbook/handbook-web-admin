<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Group } from "../../../ts/admin/interfaces/Group";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { processGroups } from "../../../ts/admin/metadata";
  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import AddGroupPanel from "../components/action-modals/AddGroupPanel.svelte";
  import ChangeGroupPanel from "../components/action-modals/ChangeGroupPanel.svelte";
  import DeleteGroupDialog from "../components/action-modals/DeleteGroupDialog.svelte";
  import ImportGroupMembersPanel from "../components/action-modals/ImportGroupMembersPanel.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { groupId: string };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  const groups = derived(
    useSWR<Record<string, Group>>(constructURL("v1.0/group")).data,
    processGroups,
    undefined
  );
  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-group"}
  <AddGroupPanel />
{:else if action === "change-group"}
  <!-- TODO: Handle SWR better -->
  {#if $groups !== undefined}
    <ChangeGroupPanel groups={$groups} payload={actionPayload} />
  {/if}
{:else if action === "delete-group"}
  <!-- TODO: Handle SWR better -->
  {#if $groups !== undefined}
    <DeleteGroupDialog groups={$groups} payload={actionPayload} />
  {/if}
{:else if action === "import-group-members"}
  <!-- TODO: Handle SWR better -->
  {#if $groups !== undefined}
    <ImportGroupMembersPanel groups={$groups} payload={actionPayload} />
  {/if}
{/if}

<h1>{$siteName + " - Uživatelské skupiny"}</h1>
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
{#if $groups === undefined}
  <LoadingIndicator />
{:else}
  {#each $groups as [id, group]}
    {#if id === "00000000-0000-0000-0000-000000000000"}
      <br />
      <h3 class="main-page public-group">{group.name}</h3>
    {:else}
      <br />
      <h3 class="main-page">{group.name}</h3>
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
      <span class="main-page">
        {"Uživatelů: " + group.count.toString()}
      </span>
    {/if}
  {/each}
{/if}
