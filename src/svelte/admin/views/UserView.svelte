<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { useLocation } from "svelte-navigator";

  import type { Role } from "../../../ts/admin/interfaces/Role";
  import type { User } from "../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../ts/admin/interfaces/UserListResponse";

  import { siteName } from "../../../ts/admin/stores";
  import EditUserGroupsPanel from "../components/action-modals/EditUserGroupsPanel.svelte";
  import EditUserRolePanel from "../components/action-modals/EditUserRolePanel.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";
  import UserViewSearchForm from "../components/UserViewSearchForm.svelte";
  import UserViewTable from "../components/UserViewTable.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { user: User };
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: actionPayload = $location.state?.actionPayload;

  let page = 1;
  const perPage = 25;
  let role: "all" | Role = "all";
  let searchName = "";
  let group = "00000000-0000-0000-0000-000000000000";

  $: payload = {
    group: group !== "00000000-0000-0000-0000-000000000000" ? group : undefined,
    name: searchName,
    page,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP argument
    "per-page": perPage,
    role: role !== "all" ? role : undefined,
  };
  $: userQuery = createQuery<UserListResponse>({
    queryKey: ["v1.0", "user", payload],
  });
  $: userListCount = $userQuery.data?.count;
  let users: Array<User> | undefined;
  $: users = $userQuery.data?.users;
</script>

{#if action === "change-user-groups"}
  <GroupProvider silent let:groups>
    <EditUserGroupsPanel {groups} payload={actionPayload} />
  </GroupProvider>
{:else if action === "change-user-role"}
  <EditUserRolePanel payload={actionPayload} />
{/if}

<h1>{`${$siteName} - Uživatelé`}</h1>
<UserViewSearchForm
  bind:searchName
  bind:role
  bind:group
  on:change={() => {
    page = 1;
  }}
/>
{#if users === undefined || userListCount === undefined}
  <LoadingIndicator />
{:else}
  <UserViewTable {users} />
  <Pagination total={Math.ceil(userListCount / perPage)} bind:current={page} />
{/if}
